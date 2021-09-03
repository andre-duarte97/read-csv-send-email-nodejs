# Projeto Read Files CSV and Send-Email

## Diretorios dos arquivos
-  O Diretório dos arquivos a serem processados devem estar na pasta "pending-files" na raíz do projeto.
- O template a ser enviado por e-mail deve está na pasta "template" na raíz do projeto.
- Deverá existir uma pasta com nome "processed-files" na raíz do projeto para os arquivos já processados".tra
- Deverá existir uma pasta "return-files" para os arquivos de retornos.

## Como rodar a aplicação

- `npm install`: Instala os pacotes necessários.
- `npm run process-csv`:[ambiente]: processa os arquivos csv e envia os e-mails e gera um arquivo de retorno na pasta "files-returns" na raíz do projeto.
- `npm run retorno`:[ambiente] : Gera os retornos do e-mails enviados.

## Premissas

- Só funciona com arquivos .csv
- Você terá que criar uma key para fazer o envio de e-mails pelo servidor configurado e adicionar no .env na chave secret-key-email.


## Regras de Negócio

- O arquivo .csv deve contem os seguintes campos obrigatórios: "NOME, EMAIL, ASSUNTO"
- Não será possível processar um arquivo com mesmo nome.