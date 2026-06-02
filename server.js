import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()

app.use(express.json())
app.use(cors())



app.get('/usuarios', async (req, res) => {

    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

app.post('/usuarios', async (req, res) => {
  try {
    const { name, email, age } = req.body

    // validação básica
    if (!name || !email || age === undefined) {
      return res.status(400).json({
        error: "Preencha todos os campos"
      })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        age: Number(age)
      }
    })

    console.log(user)

    res.status(201).json(user)

  } catch (error) {
    console.error("Erro ao criar usuário:", error)

    res.status(500).json({
      error: "Erro interno do servidor"
    })
  }
})

app.put('/usuarios/:id', async (req, res) => {
    req.params.id
    const user = await prisma.user.update({

        where: {
             id: req.params.id,
        },

        data: {
            email: req.body.email,
            age: req.body.age,
            name: req.body.name
        }
    })

    res.status(200).json(user)
})

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    })

    res.status(200).json({ message: 'Usuario deletado com sucesso!' })

  } catch (error) {
    console.log("ERRO COMPLETO:", error.response)

    res.status(404).json({
      error: "Usuário não encontrado"
    })
  }

 
  
})


app.listen(3001)
// req => requisição
// res => resposta
// http://localhost:3001
