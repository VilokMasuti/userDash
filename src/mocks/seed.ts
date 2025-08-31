import { faker } from '@faker-js/faker'
import type { Group, User } from '../../types'

faker.seed(42)

const ROLES: Array<Group['role']> = ['admin', 'manager', 'member']

const GROUP_NAMES = [
  'Standard Users',
  'Global Admins',
  'Managers',
  'Finance',
  'Engineering'
]

function makeGroup(): Group {
  return {
    id: faker.string.nanoid(),
    name: faker.helpers.arrayElement(GROUP_NAMES),
    role: faker.helpers.arrayElement(ROLES)
  }
}

function makeUser(): User {
  const first = faker.person.firstName()
  const last = faker.person.lastName()
  const name = `${first} ${last}`

  return {
    id: faker.string.uuid(),
    name,
    email: faker.internet
      .email({ firstName: first, lastName: last })
      .toLowerCase(),
    status: faker.datatype.boolean() ? 'active' : 'inactive',
    createdAt: faker.date.past({ years: 3 }).toISOString(),
    groups: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      makeGroup
    )
  }
}
export const db: { users: User[] } = {
  users: Array.from({ length: 100 }, makeUser)
}
