import 'reflect-metadata'
import { ObjectType, Field, ID, Int } from 'type-graphql'

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  emailVerified?: Date

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  wallpaperUrl?: string

  @Field({ nullable: true })
  calendarApiKey?: string

  @Field({ nullable: true })
  ntfyTopic?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
