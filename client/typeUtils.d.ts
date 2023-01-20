/**
 * https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
 * PartialBy - make one parameter or more optional, but make the others required
 * for instance:
 * interface Person = {
 *   name: string
 *   hometown: string
 *   nickname: string
 * }
 * the building blocks of how this works:
 * type PersonExcludingNickname = Omit<Person, 'nickname'> (results in {name: string, hometown: string})
 * type Nickname = Pick<Person, 'nickname'> (results in {nickname: string})
 * type OptionalNickname = Partial<Nickname> (results in {nickname?: string})
 * type PersonWithOptionalNickname = PersonExcludingNickname & OptionalNickname
 * (results in {name: string, hometown: string} & {nickname?: string} = {name: string, hometown: string, nickname?: string})
 */
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
