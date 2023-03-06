import Knex from "knex"
import fs from "fs"
import { Prisma, PrismaClient } from '@prisma/client'

let prismaInst: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> 

const initDB = () => {
  try {
    prismaInst = new PrismaClient()
  } catch (e) {
    console.log("error prisma", e)
  }
}

const getDB = () => {
  if (prismaInst) return prismaInst
  else {
    initDB()
    return
  }
}

initDB()

export { initDB, getDB }