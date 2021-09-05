const parse = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const { sendEmail } = require('./send-email')
const { formatDatePtBr } = require('./helpers/formatDates');
const formatString = require('./helpers/formatString');
const { v4: uuidv4 } = require('uuid');

const fsDir = promisify(fs.readdir)
const fsReadyFile = promisify(fs.readFile)
const directoryFiles = path.resolve(__dirname)

const filesDir = async (dir) => {
  try {
    const files = await fsDir(path.resolve(directoryFiles, '..', String(dir)))
    return files.length ? files : null
  } catch (error) {
    console.log(`Error reading folder: ${error}`)
  }
}

async function readCSV() {
  try {
    const files = await filesDir('pending-files')
    let newRows = []
    if (files) {
      files.forEach(async (file) => {
        const pathProcessed = path.resolve(directoryFiles, '..', 'processed-files', String(file))

        if (fs.existsSync(pathProcessed)) {
          return console.log(`The file: ${file} has already been processed`)
        }

        fs.createReadStream(path.resolve(directoryFiles, '..', 'pending-files', String(file)))
          .pipe(parse({
            mapHeaders: ({ header, index }) => header,
            separator: ';'
          }))
          .on('data', async (row) => {
            newRows.push({
                email: row.EMAIL,
                name: row.NOME,
                subject: row.ASSUNTO
            })
          })
          .on('end', async () => {
            await processContent(newRows, file)
            fs.rename(path.resolve(directoryFiles, '..', 'pending-files', String(file)), path.resolve(directoryFiles, '..', 'processed-files', String(file)), (err) => {
              if (err) throw err
              console.log(`File: ${file} moved to files_processed`)
            })
          })
      })
    } else {
      console.log('not exists files!')
    }
  } catch (error) {
    console.error(`Error processing file: ${error}`)
  }
}

async function processContent (rows, filename) {
  const dataReturn = []
  const filenameReturn = filename.split('.csv')[0] + '_ret.csv'
  let nameFileError = ''
  fsReadyFile(path.resolve(directoryFiles, '..', 'template', 'model_template.html'), 'utf-8').then(async (content) => {
    rows.map(async (row) => {
      let { name, email, subject } = row
      content = content.toString()

      const id = uuidv4() // uuid generate
      name = name ? String(name) : 'Anônimo'
      subject = subject ? String(subject) : ''

      const dateSend = formatDatePtBr(new Date())

      content = content.replace(/\[nome\]/g, name)
      content = content.replace(/\[email\]/g, email)
      content = content.replace(/\[assunto\]/g, subject)
      content = content.replace(/\[data_atual\]/g, dateSend)

      const emailValid = email && formatString.validaEmail(email) ? 'Válido' : 'Inválido'

      dataReturn.push({
        id,
        name,
        email,
        subject,
        dateSend,
        emailValid
      })

      const dataSendEmail = {
        name,
        email,
        subject,
        content,
      }

      try {
        if (emailValid === 'Válido') {
          const responseEmail = await sendEmail(dataSendEmail)
          console.log(responseEmail)
        }
      } catch (error) {
        nameFileError = filename.split('.csv')[0] + '_error_ret.csv'
        console.error(`Has been error to send email: ${error}`)
        return
      }
    })
    if (nameFileError !== '') {
      await retornoCSV(dataReturn, nameFileError)
      return
    }
    await retornoCSV(dataReturn, filenameReturn)
  })
    .catch(error => console.log(`An error has occurred: ${error}`))
}

async function retornoCSV (dataReturn, filename) {
  try {
    if (fs.existsSync(path.resolve(directoryFiles, '..' , 'return-files', filename))) {
      console.log(`The file: ${filename} has already generated`)
      return
    }
    const headerCsv = [
      { id: 'id', title: 'ID' },
      { id: 'nome', title: 'NOME' },
      { id: 'email', title: 'EMAIL' },
      { id: 'assunto', title: 'ASSUNTO' },
      { id: 'data_envio', title: 'DATA_ENVIO'},
      { id: 'email_valido', title: 'EMAIL_VALIDO'}
    ]

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(directoryFiles, '..', 'return-files', filename),
      header: headerCsv,
      fieldDelimiter: ';',
      headerIdDelimiter: ';'
    })

    const promiseRecords = dataReturn.map(async (data )=> {
      return {
        id:  data.id,
        nome: data.name,
        email: data.email,
        assunto: data.subject,
        data_envio: data.dateSend,
        email_valido: data.emailValid
      }
    })

    Promise.all(promiseRecords)
      .then(records => {
        csvWriter.writeRecords(records)
        console.log('successfully generated file' + filename)
      })
      .catch((error) => console.log('Error, cannot writer files csv:', error))
  } catch (error) {
    console.error(`there was some error: ${error}`)
  }
}

readCSV()