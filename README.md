# Projeto Read Files CSV and Send-Email

## Diretorios dos arquivos
-  O Diretório dos arquivos a serem processados devem estar na pasta "pending-files" na raíz do projeto.
- O template a ser enviado por e-mail deve está na pasta "template" na raíz do projeto e deve ser um arquivo .HTML. No processamento as variáveis [NOME], [EMAIL] e [ASSUNTO] devem estar entre colchetes no arquivo para ser substituído no processamento (Não é obrigatório).
- Deverá existir uma pasta com nome "processed-files" na raíz do projeto para os arquivos já processados".
- Deverá existir uma pasta "return-files" para os arquivos de retornos.

## Como rodar a aplicação

- `npm install`: Instala os pacotes necessários.
- `npm run process-csv`:[ambiente]: processa os arquivos csv e envia os e-mails e gera um arquivo de retorno na pasta "files-returns" na raíz do projeto.

## Premissas

- Só funciona com arquivos .csv e no formato UTF-8, separado por ;
- Você terá que criar uma key para fazer o envio de e-mails pelo servidor configurado e adicionar no arquivo .env na raiz do projeto, chave SECRET_KEY_EMAIL.


## Regras de Negócio

- O arquivo .csv deve contem os seguintes campos obrigatórios: "NOME, EMAIL, ASSUNTO"
- Não será possível processar um arquivo com mesmo nome.