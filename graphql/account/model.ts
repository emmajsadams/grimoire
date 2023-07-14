import 'reflect-metadata'
import { ObjectType, Field, ID, Int } from 'type-graphql'

@ObjectType()
export class Account {
  @Field((type) => ID)
  id: string

  @Field()
  userId: string

  @Field()
  type: string

  // @Field({ nullable: true })
  // type?: string

  // @Field()
  // creationDate: Date

  // @Field((type) => [String])
  // ingredients: string[]
}
