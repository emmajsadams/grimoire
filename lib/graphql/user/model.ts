import 'reflect-metadata'
import { InputType, ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  email?: string

  @Field((type) => Date, { nullable: true })
  emailVerified?: Date

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  wallpaperUrl?: string

  @Field({ nullable: true })
  calendarApiKey?: string

  @Field({ nullable: true })
  ntfyTopic?: string

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date
}

@InputType()
export class UserLoginInput {
  @Field()
  email: string

  @Field()
  password: string
}