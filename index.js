// sempre que usar uma uma função 'async', usar um 'await' antes da função


const{ select, input, checkbox } = require('@inquirer/prompts')

const fs= require("fs").promises

let mensagem = "Bem Vindo ao App de Metas!";

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {}
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })
    
    if(meta.length == 0)    {
        console.log("A meta não pode ser vazia.")
        return
    }
    metas.push(
        {value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!"
} 

const listarMetas = async () => {

    if(metas.length == 0){
        mensagem = "Não existem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as Setas para mudar de meta, o Espaço para marcar/desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas], 
        instructions: false,

    })
    
    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada!"
        return
    }

  

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

        mensagem = 'Meta(s) marcada(s) como concluída(s)'
}

const metasRealizadas = async () => {
    
    if(metas.length == 0){
        mensagem = "Não existem metas!"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    
    if(realizadas.length == 0){
        mensagem = "Não existem metas realizadas. :("
        return
    }
     
    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices:[...realizadas]
    })
}

const metasAbertas = async () => {

    if(metas.length == 0){
        mensagem = "Não existem metas!"
        return
    }
    
    const abertas = metas.filter((meta) => {
        return meta.checked != true             //poderia colocar assim !meta.checked para dizer que o boolean é falso
    })

    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas. :D"
        return
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {

    if(metas.length == 0){
        mensagem = "Não existem metas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        meta.checked = false
        return {value: meta.value, checked: false}
    })

    const itemsADeletar = await checkbox({
        message: "Selecione uma meta para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemsADeletar.length == 0) {
        mensagem = "Não existem metas a deletar."
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    

    while(true){
        mostrarMensagem()
        await salvarMetas()
        const opcao = await select({
            message: "Menu >", 
            choices: [
                {
                    name: "Cadastrar Meta",
                    value: "cadastrar"
                },

                {
                    name: "Listar Metas",
                    value: "listar"
                },

                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },

                {
                    name: "Metas Abertas",
                    value: "abertas"
                },

                {
                    name: "Deletar Metas",
                    value: "deletar"
                },

                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })
        
        
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break

            case "listar":
                await listarMetas()
                break

            case "realizadas":
                await metasRealizadas()
                break

            case "abertas":
                await metasAbertas()
                break
            
            case "deletar":
                await deletarMetas()
                break

            case "sair":
                return
        }
    }                                        //ele vai passar por tudo isso e vai fazer 10x
}

start()