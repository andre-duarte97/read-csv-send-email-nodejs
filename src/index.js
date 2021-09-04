const parse =require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const formatDate = require('./helpers/formatDates');
const formatString = require('./helpers/formatString');
const { uuid } = require('uuidv4');

const fsDir = promisify(fs.readdir)
const fsReadyFile = promisify(fs.readFile)
const directoryFiles = path.resolve(__dirname)

const filesDir = async (dir) => {
  try {
    const files = await fsDir(path.resolve(directoryFiles, '..', String(dir)))
    return files.length ? files : null
  } catch (error) {
    console.log(`Error reading folder: ${err}`)
  }
}

async function readCSV() {
  try {
    const files = await filesDir('pending-files')
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
            const newRows = {
                filename: file,
                EMAIL: row.EMAIL,
                NOME: row.NOME,
                ASSUNTO: row.ASSUNTO
            }

            console.log(newRows);
            return

            sendEmail(newRows)
          })
          .on('end', async () => {
            fs.rename(path.resolve(directoryFiles, '..', 'pending-files', String(file)), path.resolve(directoryFiles, '..', 'processed-files', String(file)), (err) => {
              if (err) throw err
              console.log(`File: ${file} moved to files_processed`)
              return
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

async function sendEmail (rows) {
  fsReadyFile(path.resolve(directoryFiles, '..', 'template', 'model_template.html'), 'utf-8').then(async (content) => {
    let { NOME, EMAIL, ASSUNTO, filename } = rows
    let conteudo = content.toString()

    const ID = uuid()
    NOME = NOME ? String(NOME) : 'Anônimo'
    ASSUNTO = ASSUNTO ? String(NOME) : ''

    const dateSend = formatDate(new Date())

    conteudo = conteudo.replace(/\[NOME\]/g, NOME)
    conteudo = conteudo.replace(/\[EMAIL\]/g, EMAIL)
    conteudo = conteudo.replace(/\[ASSUNTO\]/g, ASSUNTO)

    fs.writeFile(`${EMAIL}.html`, conteudo, function (err) {
      if (err) throw err
      console.log('New files generated.')
    })

    let fileNameReturn = filename.split('.csv')[0] + '_ret'

    const dataReturn = [{
      ID,
      NOME,
      EMAIL,
      ASSUNTO,
      DATA_ENVIO: dateSend
    }]

    if (!formatString.validaEmail(EMAIL)) {
      fileNameReturn = filename.split('.csv')[0] + 'error_ret.csv'
      retornoCSV(dataReturn, nameFileError)

      console.log(`Email invalid or does not exist on line ${ID} into file: ${filename}`)

      return
    }

    const dataSend = {
      nameTo: NOME,
      to: EMAIL,
      subject: ASSUNTO,
      content: conteudo,
      tag: filename
    }

    // regra de envio com nodemailer / IMPLEMENTAR

    try {
      console.log(dataSend)
    } catch (error) {
      console.error(`Has been error to send email: ${error}`)
    }
  })
    .catch(error => console.log(`An error has occurred: ${error}`))
}

async function retornoCSV (dataReturn, filename) {
  try {
    if (fs.existsSync(directoryFiles + 'files_return', filename)) {
        return console.log(`The file: ${filename} has already been created`)
    }

    const headerCsv = [
      { id: 'id', title: 'ID' },
      { id: 'nome', title: 'NOME' },
      { id: 'email', title: 'EMAIL' },
      { id: 'assunto', title: 'ASSUNTO' }
    ]

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(directoryFiles, '..', 'return_filess', filename),
      header: headerCsv
    })

    const promiseRecords = dataReturn.map(data => {
      const id = data.ID
      const nameTo = data.NOME
      const emailTo = data.EMAIL
      const dateSend = data.DATA_ENVIO
      const subject = data.ASSUNTO

      return {
        id: id,
        nome: nameTo,
        email: emailTo,
        assunto: subject,
        data_envio: dateSend,
      }
    })

    Promise.all(promiseRecords)
      .then(records => {
        csvWriter.writeRecords(records)
        console.log('successfully generated files')
      })
      .catch((error) => console.log('Error, cannot writer files csv:', error))
  } catch (error) {
    console.error(`there was some error: ${error}`)
  }
}

readCSV()