// sempre que usar uma uma função 'async', usar um 'await' antes da função


const{ select, input } = require('@inquirer/prompts')
let meta = {
    value: 'Tomar 3L de agua por dia',
    checked: false,
}
let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })
    
    if(meta.length == 0)    {
        console.log("A meta não pode ser vazia.")
        return
    }
    metas.push(
        {value: meta, checked: false }
    )
} 

const start = async () => {

    while(true){
        
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
                    name: "Sair",
                    value: "sair"
                }
            ]
        })
        
        
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                console.log("vamos listar!")
                break
            case "sair":
                return
        }
    }                                        //ele vai passar por tudo isso e vai fazer 10x
}

start()