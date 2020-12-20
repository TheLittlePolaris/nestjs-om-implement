import { Injectable } from '@nestjs/common'
import {} from './interface/client-node.interface'
import { from } from 'rxjs'
import { join } from 'path'

@Injectable()
export class ClientNodeService {
  private outFileLocation = '../../output'
  private outDir = join(__dirname, '../../output')

  constructor() {}

  async getAll(): Promise<Node[]> {
    // return Promise.resolve(items);
    return null
  }

  async getById(id: number): Promise<Node> {
    return null
    // const res = items.find((item) => item.id === id);
    // return Promise.resolve(res);
  }
}
