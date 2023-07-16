import 'reflect-metadata'
import { InputType, ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Note {
  @Field(() => ID)
  id: string

  @Field()
  version: string

  @Field()
  ownerId: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => Date, { nullable: true })
  due?: Date

  @Field({ nullable: true })
  allDay?: boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@InputType()
export class NoteSearchInput {
  @Field()
  title: string

  @Field()
  status: string
}

@InputType()
export class NoteIdInput {
  @Field()
  id: string
}

@InputType()
export class UpdateNoteInput {
  @Field()
  id: string

  @Field()
  note: string
}
