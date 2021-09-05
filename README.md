# Projeto Read Files CSV and Send-Email

## Diretorios dos arquivos
-  O Diretório dos arquivos a serem processados devem estar na pasta "pending-files" na raíz do projeto.
- O template a ser enviado por e-mail deve está na pasta "template" (deixei disponibilizado um arquivo para teste, mas pode usar qualquer outro) na raíz do projeto e deve ser um arquivo .HTML. No .HTML as variáveis [NOME], [EMAIL] e [ASSUNTO] devem estar entre colchetes no arquivo para ser substituído no processamento (Não é obrigatório).
- Deverá existir uma pasta com nome "processed-files" na raíz do projeto para os arquivos já processados".
- Deverá existir uma pasta "return-files" para os arquivos de retornos.

## Como rodar a aplicação

- digite no seu terminal `mkdir read-csv-send-email` e `cd read-csv-send-email`.
- `npm install`: Instala os pacotes necessários.
- `npm run start`: processa os arquivos csv que estiveren na pasta "pending-files", envia os e-mails e gera um arquivo de retorno na pasta "files-returns" na raíz do projeto.
OBS: Se dê algum erro no envio ou se o e-mail for inválido, ele vai gerar um arquivo de retorno de log.

## Premissas

- Só funciona com arquivos .csv e no formato UTF-8, separado por ;
- Você terá que setar as configurações de uma conta de e-mail para fazer o envio de e-mails e adicionar as credenciais (Host, Porta, User e Pass) no arquivo .env na raiz do projeto. Nesse projeto eu utilizei a minha conta do Gmail somente para fins de testes, mas para isso é necesário desabilitar a função "Acesso a app menos seguro" nas configurações de segurança da sua conta ou adicione uma outra conta se desejar.


## Regras de Negócio

- O arquivo .csv deve contem os seguintes campos obrigatórios: "NOME, EMAIL, ASSUNTO" em maiúsculo.
- Não será possível processar um arquivo com mesmo nome.