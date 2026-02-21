
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Example
 * 
 */
export type Example = $Result.DefaultSelection<Prisma.$ExamplePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model EmailVerificationToken
 * 
 */
export type EmailVerificationToken = $Result.DefaultSelection<Prisma.$EmailVerificationTokenPayload>
/**
 * Model PasswordChangeToken
 * 
 */
export type PasswordChangeToken = $Result.DefaultSelection<Prisma.$PasswordChangeTokenPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model Answer
 * 
 */
export type Answer = $Result.DefaultSelection<Prisma.$AnswerPayload>
/**
 * Model Signup
 * 
 */
export type Signup = $Result.DefaultSelection<Prisma.$SignupPayload>
/**
 * Model RaffleSimulation
 * 
 */
export type RaffleSimulation = $Result.DefaultSelection<Prisma.$RaffleSimulationPayload>
/**
 * Model Quota
 * 
 */
export type Quota = $Result.DefaultSelection<Prisma.$QuotaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  user: 'user',
  admin: 'admin'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const RaffleStatus: {
  NOT_STARTED: 'NOT_STARTED',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  SIMULATING: 'SIMULATING',
  COMPLETED: 'COMPLETED'
};

export type RaffleStatus = (typeof RaffleStatus)[keyof typeof RaffleStatus]


export const QuestionType: {
  text: 'text',
  textarea: 'textarea',
  radio: 'radio',
  checkbox: 'checkbox'
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]


export const SignupStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED'
};

export type SignupStatus = (typeof SignupStatus)[keyof typeof SignupStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type RaffleStatus = $Enums.RaffleStatus

export const RaffleStatus: typeof $Enums.RaffleStatus

export type QuestionType = $Enums.QuestionType

export const QuestionType: typeof $Enums.QuestionType

export type SignupStatus = $Enums.SignupStatus

export const SignupStatus: typeof $Enums.SignupStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Examples
 * const examples = await prisma.example.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Examples
   * const examples = await prisma.example.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.example`: Exposes CRUD operations for the **Example** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Examples
    * const examples = await prisma.example.findMany()
    * ```
    */
  get example(): Prisma.ExampleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.emailVerificationToken`: Exposes CRUD operations for the **EmailVerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailVerificationTokens
    * const emailVerificationTokens = await prisma.emailVerificationToken.findMany()
    * ```
    */
  get emailVerificationToken(): Prisma.EmailVerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordChangeToken`: Exposes CRUD operations for the **PasswordChangeToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordChangeTokens
    * const passwordChangeTokens = await prisma.passwordChangeToken.findMany()
    * ```
    */
  get passwordChangeToken(): Prisma.PasswordChangeTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.answer`: Exposes CRUD operations for the **Answer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Answers
    * const answers = await prisma.answer.findMany()
    * ```
    */
  get answer(): Prisma.AnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.signup`: Exposes CRUD operations for the **Signup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Signups
    * const signups = await prisma.signup.findMany()
    * ```
    */
  get signup(): Prisma.SignupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.raffleSimulation`: Exposes CRUD operations for the **RaffleSimulation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RaffleSimulations
    * const raffleSimulations = await prisma.raffleSimulation.findMany()
    * ```
    */
  get raffleSimulation(): Prisma.RaffleSimulationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quota`: Exposes CRUD operations for the **Quota** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quotas
    * const quotas = await prisma.quota.findMany()
    * ```
    */
  get quota(): Prisma.QuotaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Example: 'Example',
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    Verification: 'Verification',
    EmailVerificationToken: 'EmailVerificationToken',
    PasswordChangeToken: 'PasswordChangeToken',
    Event: 'Event',
    Question: 'Question',
    Answer: 'Answer',
    Signup: 'Signup',
    RaffleSimulation: 'RaffleSimulation',
    Quota: 'Quota'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "example" | "user" | "account" | "session" | "verification" | "emailVerificationToken" | "passwordChangeToken" | "event" | "question" | "answer" | "signup" | "raffleSimulation" | "quota"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Example: {
        payload: Prisma.$ExamplePayload<ExtArgs>
        fields: Prisma.ExampleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExampleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExampleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          findFirst: {
            args: Prisma.ExampleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExampleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          findMany: {
            args: Prisma.ExampleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>[]
          }
          create: {
            args: Prisma.ExampleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          createMany: {
            args: Prisma.ExampleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExampleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>[]
          }
          delete: {
            args: Prisma.ExampleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          update: {
            args: Prisma.ExampleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          deleteMany: {
            args: Prisma.ExampleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExampleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExampleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>[]
          }
          upsert: {
            args: Prisma.ExampleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamplePayload>
          }
          aggregate: {
            args: Prisma.ExampleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExample>
          }
          groupBy: {
            args: Prisma.ExampleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExampleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExampleCountArgs<ExtArgs>
            result: $Utils.Optional<ExampleCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      EmailVerificationToken: {
        payload: Prisma.$EmailVerificationTokenPayload<ExtArgs>
        fields: Prisma.EmailVerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailVerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.EmailVerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          findMany: {
            args: Prisma.EmailVerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          create: {
            args: Prisma.EmailVerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          createMany: {
            args: Prisma.EmailVerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.EmailVerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          update: {
            args: Prisma.EmailVerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.EmailVerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailVerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.EmailVerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.EmailVerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailVerificationToken>
          }
          groupBy: {
            args: Prisma.EmailVerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailVerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      PasswordChangeToken: {
        payload: Prisma.$PasswordChangeTokenPayload<ExtArgs>
        fields: Prisma.PasswordChangeTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordChangeTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordChangeTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordChangeTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordChangeTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordChangeTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordChangeTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordChangeTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordChangeTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordChangeTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          update: {
            args: Prisma.PasswordChangeTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordChangeTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordChangeTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordChangeTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>[]
          }
          upsert: {
            args: Prisma.PasswordChangeTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordChangeTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordChangeTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordChangeToken>
          }
          groupBy: {
            args: Prisma.PasswordChangeTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordChangeTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordChangeTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordChangeTokenCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
          }
        }
      }
      Answer: {
        payload: Prisma.$AnswerPayload<ExtArgs>
        fields: Prisma.AnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          findFirst: {
            args: Prisma.AnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          findMany: {
            args: Prisma.AnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>[]
          }
          create: {
            args: Prisma.AnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          createMany: {
            args: Prisma.AnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>[]
          }
          delete: {
            args: Prisma.AnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          update: {
            args: Prisma.AnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          deleteMany: {
            args: Prisma.AnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>[]
          }
          upsert: {
            args: Prisma.AnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswerPayload>
          }
          aggregate: {
            args: Prisma.AnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnswer>
          }
          groupBy: {
            args: Prisma.AnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnswerCountArgs<ExtArgs>
            result: $Utils.Optional<AnswerCountAggregateOutputType> | number
          }
        }
      }
      Signup: {
        payload: Prisma.$SignupPayload<ExtArgs>
        fields: Prisma.SignupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SignupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SignupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          findFirst: {
            args: Prisma.SignupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SignupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          findMany: {
            args: Prisma.SignupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>[]
          }
          create: {
            args: Prisma.SignupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          createMany: {
            args: Prisma.SignupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SignupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>[]
          }
          delete: {
            args: Prisma.SignupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          update: {
            args: Prisma.SignupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          deleteMany: {
            args: Prisma.SignupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SignupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SignupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>[]
          }
          upsert: {
            args: Prisma.SignupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignupPayload>
          }
          aggregate: {
            args: Prisma.SignupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignup>
          }
          groupBy: {
            args: Prisma.SignupGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignupGroupByOutputType>[]
          }
          count: {
            args: Prisma.SignupCountArgs<ExtArgs>
            result: $Utils.Optional<SignupCountAggregateOutputType> | number
          }
        }
      }
      RaffleSimulation: {
        payload: Prisma.$RaffleSimulationPayload<ExtArgs>
        fields: Prisma.RaffleSimulationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RaffleSimulationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RaffleSimulationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          findFirst: {
            args: Prisma.RaffleSimulationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RaffleSimulationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          findMany: {
            args: Prisma.RaffleSimulationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>[]
          }
          create: {
            args: Prisma.RaffleSimulationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          createMany: {
            args: Prisma.RaffleSimulationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RaffleSimulationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>[]
          }
          delete: {
            args: Prisma.RaffleSimulationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          update: {
            args: Prisma.RaffleSimulationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          deleteMany: {
            args: Prisma.RaffleSimulationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RaffleSimulationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RaffleSimulationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>[]
          }
          upsert: {
            args: Prisma.RaffleSimulationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RaffleSimulationPayload>
          }
          aggregate: {
            args: Prisma.RaffleSimulationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRaffleSimulation>
          }
          groupBy: {
            args: Prisma.RaffleSimulationGroupByArgs<ExtArgs>
            result: $Utils.Optional<RaffleSimulationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RaffleSimulationCountArgs<ExtArgs>
            result: $Utils.Optional<RaffleSimulationCountAggregateOutputType> | number
          }
        }
      }
      Quota: {
        payload: Prisma.$QuotaPayload<ExtArgs>
        fields: Prisma.QuotaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          findFirst: {
            args: Prisma.QuotaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          findMany: {
            args: Prisma.QuotaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>[]
          }
          create: {
            args: Prisma.QuotaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          createMany: {
            args: Prisma.QuotaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuotaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>[]
          }
          delete: {
            args: Prisma.QuotaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          update: {
            args: Prisma.QuotaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          deleteMany: {
            args: Prisma.QuotaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuotaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>[]
          }
          upsert: {
            args: Prisma.QuotaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotaPayload>
          }
          aggregate: {
            args: Prisma.QuotaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuota>
          }
          groupBy: {
            args: Prisma.QuotaGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotaGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotaCountArgs<ExtArgs>
            result: $Utils.Optional<QuotaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    example?: ExampleOmit
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verification?: VerificationOmit
    emailVerificationToken?: EmailVerificationTokenOmit
    passwordChangeToken?: PasswordChangeTokenOmit
    event?: EventOmit
    question?: QuestionOmit
    answer?: AnswerOmit
    signup?: SignupOmit
    raffleSimulation?: RaffleSimulationOmit
    quota?: QuotaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    Questions: number
    Quotas: number
    raffleSimulations: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Questions?: boolean | EventCountOutputTypeCountQuestionsArgs
    Quotas?: boolean | EventCountOutputTypeCountQuotasArgs
    raffleSimulations?: boolean | EventCountOutputTypeCountRaffleSimulationsArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountQuotasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotaWhereInput
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountRaffleSimulationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleSimulationWhereInput
  }


  /**
   * Count Type QuestionCountOutputType
   */

  export type QuestionCountOutputType = {
    Answers: number
  }

  export type QuestionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Answers?: boolean | QuestionCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionCountOutputType
     */
    select?: QuestionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnswerWhereInput
  }


  /**
   * Count Type SignupCountOutputType
   */

  export type SignupCountOutputType = {
    Answers: number
  }

  export type SignupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Answers?: boolean | SignupCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * SignupCountOutputType without action
   */
  export type SignupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignupCountOutputType
     */
    select?: SignupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SignupCountOutputType without action
   */
  export type SignupCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnswerWhereInput
  }


  /**
   * Count Type QuotaCountOutputType
   */

  export type QuotaCountOutputType = {
    Signups: number
    OriginalSignups: number
  }

  export type QuotaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Signups?: boolean | QuotaCountOutputTypeCountSignupsArgs
    OriginalSignups?: boolean | QuotaCountOutputTypeCountOriginalSignupsArgs
  }

  // Custom InputTypes
  /**
   * QuotaCountOutputType without action
   */
  export type QuotaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotaCountOutputType
     */
    select?: QuotaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuotaCountOutputType without action
   */
  export type QuotaCountOutputTypeCountSignupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignupWhereInput
  }

  /**
   * QuotaCountOutputType without action
   */
  export type QuotaCountOutputTypeCountOriginalSignupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignupWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Example
   */

  export type AggregateExample = {
    _count: ExampleCountAggregateOutputType | null
    _min: ExampleMinAggregateOutputType | null
    _max: ExampleMaxAggregateOutputType | null
  }

  export type ExampleMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExampleMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExampleCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExampleMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExampleMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExampleCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExampleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Example to aggregate.
     */
    where?: ExampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examples to fetch.
     */
    orderBy?: ExampleOrderByWithRelationInput | ExampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Examples
    **/
    _count?: true | ExampleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExampleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExampleMaxAggregateInputType
  }

  export type GetExampleAggregateType<T extends ExampleAggregateArgs> = {
        [P in keyof T & keyof AggregateExample]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExample[P]>
      : GetScalarType<T[P], AggregateExample[P]>
  }




  export type ExampleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExampleWhereInput
    orderBy?: ExampleOrderByWithAggregationInput | ExampleOrderByWithAggregationInput[]
    by: ExampleScalarFieldEnum[] | ExampleScalarFieldEnum
    having?: ExampleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExampleCountAggregateInputType | true
    _min?: ExampleMinAggregateInputType
    _max?: ExampleMaxAggregateInputType
  }

  export type ExampleGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    _count: ExampleCountAggregateOutputType | null
    _min: ExampleMinAggregateOutputType | null
    _max: ExampleMaxAggregateOutputType | null
  }

  type GetExampleGroupByPayload<T extends ExampleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExampleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExampleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExampleGroupByOutputType[P]>
            : GetScalarType<T[P], ExampleGroupByOutputType[P]>
        }
      >
    >


  export type ExampleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["example"]>

  export type ExampleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["example"]>

  export type ExampleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["example"]>

  export type ExampleSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExampleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt", ExtArgs["result"]["example"]>

  export type $ExamplePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Example"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["example"]>
    composites: {}
  }

  type ExampleGetPayload<S extends boolean | null | undefined | ExampleDefaultArgs> = $Result.GetResult<Prisma.$ExamplePayload, S>

  type ExampleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExampleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExampleCountAggregateInputType | true
    }

  export interface ExampleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Example'], meta: { name: 'Example' } }
    /**
     * Find zero or one Example that matches the filter.
     * @param {ExampleFindUniqueArgs} args - Arguments to find a Example
     * @example
     * // Get one Example
     * const example = await prisma.example.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExampleFindUniqueArgs>(args: SelectSubset<T, ExampleFindUniqueArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Example that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExampleFindUniqueOrThrowArgs} args - Arguments to find a Example
     * @example
     * // Get one Example
     * const example = await prisma.example.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExampleFindUniqueOrThrowArgs>(args: SelectSubset<T, ExampleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Example that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleFindFirstArgs} args - Arguments to find a Example
     * @example
     * // Get one Example
     * const example = await prisma.example.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExampleFindFirstArgs>(args?: SelectSubset<T, ExampleFindFirstArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Example that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleFindFirstOrThrowArgs} args - Arguments to find a Example
     * @example
     * // Get one Example
     * const example = await prisma.example.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExampleFindFirstOrThrowArgs>(args?: SelectSubset<T, ExampleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Examples that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Examples
     * const examples = await prisma.example.findMany()
     * 
     * // Get first 10 Examples
     * const examples = await prisma.example.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exampleWithIdOnly = await prisma.example.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExampleFindManyArgs>(args?: SelectSubset<T, ExampleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Example.
     * @param {ExampleCreateArgs} args - Arguments to create a Example.
     * @example
     * // Create one Example
     * const Example = await prisma.example.create({
     *   data: {
     *     // ... data to create a Example
     *   }
     * })
     * 
     */
    create<T extends ExampleCreateArgs>(args: SelectSubset<T, ExampleCreateArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Examples.
     * @param {ExampleCreateManyArgs} args - Arguments to create many Examples.
     * @example
     * // Create many Examples
     * const example = await prisma.example.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExampleCreateManyArgs>(args?: SelectSubset<T, ExampleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Examples and returns the data saved in the database.
     * @param {ExampleCreateManyAndReturnArgs} args - Arguments to create many Examples.
     * @example
     * // Create many Examples
     * const example = await prisma.example.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Examples and only return the `id`
     * const exampleWithIdOnly = await prisma.example.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExampleCreateManyAndReturnArgs>(args?: SelectSubset<T, ExampleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Example.
     * @param {ExampleDeleteArgs} args - Arguments to delete one Example.
     * @example
     * // Delete one Example
     * const Example = await prisma.example.delete({
     *   where: {
     *     // ... filter to delete one Example
     *   }
     * })
     * 
     */
    delete<T extends ExampleDeleteArgs>(args: SelectSubset<T, ExampleDeleteArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Example.
     * @param {ExampleUpdateArgs} args - Arguments to update one Example.
     * @example
     * // Update one Example
     * const example = await prisma.example.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExampleUpdateArgs>(args: SelectSubset<T, ExampleUpdateArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Examples.
     * @param {ExampleDeleteManyArgs} args - Arguments to filter Examples to delete.
     * @example
     * // Delete a few Examples
     * const { count } = await prisma.example.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExampleDeleteManyArgs>(args?: SelectSubset<T, ExampleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Examples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Examples
     * const example = await prisma.example.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExampleUpdateManyArgs>(args: SelectSubset<T, ExampleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Examples and returns the data updated in the database.
     * @param {ExampleUpdateManyAndReturnArgs} args - Arguments to update many Examples.
     * @example
     * // Update many Examples
     * const example = await prisma.example.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Examples and only return the `id`
     * const exampleWithIdOnly = await prisma.example.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExampleUpdateManyAndReturnArgs>(args: SelectSubset<T, ExampleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Example.
     * @param {ExampleUpsertArgs} args - Arguments to update or create a Example.
     * @example
     * // Update or create a Example
     * const example = await prisma.example.upsert({
     *   create: {
     *     // ... data to create a Example
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Example we want to update
     *   }
     * })
     */
    upsert<T extends ExampleUpsertArgs>(args: SelectSubset<T, ExampleUpsertArgs<ExtArgs>>): Prisma__ExampleClient<$Result.GetResult<Prisma.$ExamplePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Examples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleCountArgs} args - Arguments to filter Examples to count.
     * @example
     * // Count the number of Examples
     * const count = await prisma.example.count({
     *   where: {
     *     // ... the filter for the Examples we want to count
     *   }
     * })
    **/
    count<T extends ExampleCountArgs>(
      args?: Subset<T, ExampleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExampleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Example.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExampleAggregateArgs>(args: Subset<T, ExampleAggregateArgs>): Prisma.PrismaPromise<GetExampleAggregateType<T>>

    /**
     * Group by Example.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExampleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExampleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExampleGroupByArgs['orderBy'] }
        : { orderBy?: ExampleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExampleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExampleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Example model
   */
  readonly fields: ExampleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Example.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExampleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Example model
   */
  interface ExampleFieldRefs {
    readonly id: FieldRef<"Example", 'String'>
    readonly createdAt: FieldRef<"Example", 'DateTime'>
    readonly updatedAt: FieldRef<"Example", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Example findUnique
   */
  export type ExampleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter, which Example to fetch.
     */
    where: ExampleWhereUniqueInput
  }

  /**
   * Example findUniqueOrThrow
   */
  export type ExampleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter, which Example to fetch.
     */
    where: ExampleWhereUniqueInput
  }

  /**
   * Example findFirst
   */
  export type ExampleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter, which Example to fetch.
     */
    where?: ExampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examples to fetch.
     */
    orderBy?: ExampleOrderByWithRelationInput | ExampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Examples.
     */
    cursor?: ExampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Examples.
     */
    distinct?: ExampleScalarFieldEnum | ExampleScalarFieldEnum[]
  }

  /**
   * Example findFirstOrThrow
   */
  export type ExampleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter, which Example to fetch.
     */
    where?: ExampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examples to fetch.
     */
    orderBy?: ExampleOrderByWithRelationInput | ExampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Examples.
     */
    cursor?: ExampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Examples.
     */
    distinct?: ExampleScalarFieldEnum | ExampleScalarFieldEnum[]
  }

  /**
   * Example findMany
   */
  export type ExampleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter, which Examples to fetch.
     */
    where?: ExampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Examples to fetch.
     */
    orderBy?: ExampleOrderByWithRelationInput | ExampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Examples.
     */
    cursor?: ExampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Examples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Examples.
     */
    skip?: number
    distinct?: ExampleScalarFieldEnum | ExampleScalarFieldEnum[]
  }

  /**
   * Example create
   */
  export type ExampleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * The data needed to create a Example.
     */
    data: XOR<ExampleCreateInput, ExampleUncheckedCreateInput>
  }

  /**
   * Example createMany
   */
  export type ExampleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Examples.
     */
    data: ExampleCreateManyInput | ExampleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Example createManyAndReturn
   */
  export type ExampleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * The data used to create many Examples.
     */
    data: ExampleCreateManyInput | ExampleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Example update
   */
  export type ExampleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * The data needed to update a Example.
     */
    data: XOR<ExampleUpdateInput, ExampleUncheckedUpdateInput>
    /**
     * Choose, which Example to update.
     */
    where: ExampleWhereUniqueInput
  }

  /**
   * Example updateMany
   */
  export type ExampleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Examples.
     */
    data: XOR<ExampleUpdateManyMutationInput, ExampleUncheckedUpdateManyInput>
    /**
     * Filter which Examples to update
     */
    where?: ExampleWhereInput
    /**
     * Limit how many Examples to update.
     */
    limit?: number
  }

  /**
   * Example updateManyAndReturn
   */
  export type ExampleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * The data used to update Examples.
     */
    data: XOR<ExampleUpdateManyMutationInput, ExampleUncheckedUpdateManyInput>
    /**
     * Filter which Examples to update
     */
    where?: ExampleWhereInput
    /**
     * Limit how many Examples to update.
     */
    limit?: number
  }

  /**
   * Example upsert
   */
  export type ExampleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * The filter to search for the Example to update in case it exists.
     */
    where: ExampleWhereUniqueInput
    /**
     * In case the Example found by the `where` argument doesn't exist, create a new Example with this data.
     */
    create: XOR<ExampleCreateInput, ExampleUncheckedCreateInput>
    /**
     * In case the Example was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExampleUpdateInput, ExampleUncheckedUpdateInput>
  }

  /**
   * Example delete
   */
  export type ExampleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
    /**
     * Filter which Example to delete.
     */
    where: ExampleWhereUniqueInput
  }

  /**
   * Example deleteMany
   */
  export type ExampleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Examples to delete
     */
    where?: ExampleWhereInput
    /**
     * Limit how many Examples to delete.
     */
    limit?: number
  }

  /**
   * Example without action
   */
  export type ExampleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Example
     */
    select?: ExampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Example
     */
    omit?: ExampleOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: boolean
    image: string | null
    role: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: boolean
      image: string | null
      role: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model EmailVerificationToken
   */

  export type AggregateEmailVerificationToken = {
    _count: EmailVerificationTokenCountAggregateOutputType | null
    _min: EmailVerificationTokenMinAggregateOutputType | null
    _max: EmailVerificationTokenMaxAggregateOutputType | null
  }

  export type EmailVerificationTokenMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
    email: string | null
  }

  export type EmailVerificationTokenMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
    email: string | null
  }

  export type EmailVerificationTokenCountAggregateOutputType = {
    id: number
    createdAt: number
    expiresAt: number
    email: number
    _all: number
  }


  export type EmailVerificationTokenMinAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
  }

  export type EmailVerificationTokenMaxAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
  }

  export type EmailVerificationTokenCountAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
    _all?: true
  }

  export type EmailVerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerificationToken to aggregate.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailVerificationTokens
    **/
    _count?: true | EmailVerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailVerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailVerificationTokenMaxAggregateInputType
  }

  export type GetEmailVerificationTokenAggregateType<T extends EmailVerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailVerificationToken[P]>
      : GetScalarType<T[P], AggregateEmailVerificationToken[P]>
  }




  export type EmailVerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailVerificationTokenWhereInput
    orderBy?: EmailVerificationTokenOrderByWithAggregationInput | EmailVerificationTokenOrderByWithAggregationInput[]
    by: EmailVerificationTokenScalarFieldEnum[] | EmailVerificationTokenScalarFieldEnum
    having?: EmailVerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailVerificationTokenCountAggregateInputType | true
    _min?: EmailVerificationTokenMinAggregateInputType
    _max?: EmailVerificationTokenMaxAggregateInputType
  }

  export type EmailVerificationTokenGroupByOutputType = {
    id: string
    createdAt: Date
    expiresAt: Date
    email: string
    _count: EmailVerificationTokenCountAggregateOutputType | null
    _min: EmailVerificationTokenMinAggregateOutputType | null
    _max: EmailVerificationTokenMaxAggregateOutputType | null
  }

  type GetEmailVerificationTokenGroupByPayload<T extends EmailVerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailVerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailVerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailVerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], EmailVerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type EmailVerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectScalar = {
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }

  export type EmailVerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "expiresAt" | "email", ExtArgs["result"]["emailVerificationToken"]>

  export type $EmailVerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailVerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      expiresAt: Date
      email: string
    }, ExtArgs["result"]["emailVerificationToken"]>
    composites: {}
  }

  type EmailVerificationTokenGetPayload<S extends boolean | null | undefined | EmailVerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$EmailVerificationTokenPayload, S>

  type EmailVerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmailVerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmailVerificationTokenCountAggregateInputType | true
    }

  export interface EmailVerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailVerificationToken'], meta: { name: 'EmailVerificationToken' } }
    /**
     * Find zero or one EmailVerificationToken that matches the filter.
     * @param {EmailVerificationTokenFindUniqueArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailVerificationTokenFindUniqueArgs>(args: SelectSubset<T, EmailVerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmailVerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailVerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailVerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailVerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindFirstArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailVerificationTokenFindFirstArgs>(args?: SelectSubset<T, EmailVerificationTokenFindFirstArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailVerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindFirstOrThrowArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailVerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmailVerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailVerificationTokens
     * const emailVerificationTokens = await prisma.emailVerificationToken.findMany()
     * 
     * // Get first 10 EmailVerificationTokens
     * const emailVerificationTokens = await prisma.emailVerificationToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailVerificationTokenFindManyArgs>(args?: SelectSubset<T, EmailVerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmailVerificationToken.
     * @param {EmailVerificationTokenCreateArgs} args - Arguments to create a EmailVerificationToken.
     * @example
     * // Create one EmailVerificationToken
     * const EmailVerificationToken = await prisma.emailVerificationToken.create({
     *   data: {
     *     // ... data to create a EmailVerificationToken
     *   }
     * })
     * 
     */
    create<T extends EmailVerificationTokenCreateArgs>(args: SelectSubset<T, EmailVerificationTokenCreateArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmailVerificationTokens.
     * @param {EmailVerificationTokenCreateManyArgs} args - Arguments to create many EmailVerificationTokens.
     * @example
     * // Create many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailVerificationTokenCreateManyArgs>(args?: SelectSubset<T, EmailVerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailVerificationTokens and returns the data saved in the database.
     * @param {EmailVerificationTokenCreateManyAndReturnArgs} args - Arguments to create many EmailVerificationTokens.
     * @example
     * // Create many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailVerificationTokens and only return the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailVerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmailVerificationToken.
     * @param {EmailVerificationTokenDeleteArgs} args - Arguments to delete one EmailVerificationToken.
     * @example
     * // Delete one EmailVerificationToken
     * const EmailVerificationToken = await prisma.emailVerificationToken.delete({
     *   where: {
     *     // ... filter to delete one EmailVerificationToken
     *   }
     * })
     * 
     */
    delete<T extends EmailVerificationTokenDeleteArgs>(args: SelectSubset<T, EmailVerificationTokenDeleteArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmailVerificationToken.
     * @param {EmailVerificationTokenUpdateArgs} args - Arguments to update one EmailVerificationToken.
     * @example
     * // Update one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailVerificationTokenUpdateArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmailVerificationTokens.
     * @param {EmailVerificationTokenDeleteManyArgs} args - Arguments to filter EmailVerificationTokens to delete.
     * @example
     * // Delete a few EmailVerificationTokens
     * const { count } = await prisma.emailVerificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailVerificationTokenDeleteManyArgs>(args?: SelectSubset<T, EmailVerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailVerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailVerificationTokenUpdateManyArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailVerificationTokens and returns the data updated in the database.
     * @param {EmailVerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many EmailVerificationTokens.
     * @example
     * // Update many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmailVerificationTokens and only return the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmailVerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmailVerificationToken.
     * @param {EmailVerificationTokenUpsertArgs} args - Arguments to update or create a EmailVerificationToken.
     * @example
     * // Update or create a EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.upsert({
     *   create: {
     *     // ... data to create a EmailVerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailVerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends EmailVerificationTokenUpsertArgs>(args: SelectSubset<T, EmailVerificationTokenUpsertArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmailVerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenCountArgs} args - Arguments to filter EmailVerificationTokens to count.
     * @example
     * // Count the number of EmailVerificationTokens
     * const count = await prisma.emailVerificationToken.count({
     *   where: {
     *     // ... the filter for the EmailVerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends EmailVerificationTokenCountArgs>(
      args?: Subset<T, EmailVerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailVerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailVerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailVerificationTokenAggregateArgs>(args: Subset<T, EmailVerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetEmailVerificationTokenAggregateType<T>>

    /**
     * Group by EmailVerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailVerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailVerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: EmailVerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailVerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailVerificationToken model
   */
  readonly fields: EmailVerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailVerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailVerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailVerificationToken model
   */
  interface EmailVerificationTokenFieldRefs {
    readonly id: FieldRef<"EmailVerificationToken", 'String'>
    readonly createdAt: FieldRef<"EmailVerificationToken", 'DateTime'>
    readonly expiresAt: FieldRef<"EmailVerificationToken", 'DateTime'>
    readonly email: FieldRef<"EmailVerificationToken", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EmailVerificationToken findUnique
   */
  export type EmailVerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken findUniqueOrThrow
   */
  export type EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken findFirst
   */
  export type EmailVerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerificationTokens.
     */
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken findFirstOrThrow
   */
  export type EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerificationTokens.
     */
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken findMany
   */
  export type EmailVerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which EmailVerificationTokens to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken create
   */
  export type EmailVerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a EmailVerificationToken.
     */
    data: XOR<EmailVerificationTokenCreateInput, EmailVerificationTokenUncheckedCreateInput>
  }

  /**
   * EmailVerificationToken createMany
   */
  export type EmailVerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailVerificationTokens.
     */
    data: EmailVerificationTokenCreateManyInput | EmailVerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailVerificationToken createManyAndReturn
   */
  export type EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many EmailVerificationTokens.
     */
    data: EmailVerificationTokenCreateManyInput | EmailVerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailVerificationToken update
   */
  export type EmailVerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a EmailVerificationToken.
     */
    data: XOR<EmailVerificationTokenUpdateInput, EmailVerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which EmailVerificationToken to update.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken updateMany
   */
  export type EmailVerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailVerificationTokens.
     */
    data: XOR<EmailVerificationTokenUpdateManyMutationInput, EmailVerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which EmailVerificationTokens to update
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to update.
     */
    limit?: number
  }

  /**
   * EmailVerificationToken updateManyAndReturn
   */
  export type EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update EmailVerificationTokens.
     */
    data: XOR<EmailVerificationTokenUpdateManyMutationInput, EmailVerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which EmailVerificationTokens to update
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to update.
     */
    limit?: number
  }

  /**
   * EmailVerificationToken upsert
   */
  export type EmailVerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the EmailVerificationToken to update in case it exists.
     */
    where: EmailVerificationTokenWhereUniqueInput
    /**
     * In case the EmailVerificationToken found by the `where` argument doesn't exist, create a new EmailVerificationToken with this data.
     */
    create: XOR<EmailVerificationTokenCreateInput, EmailVerificationTokenUncheckedCreateInput>
    /**
     * In case the EmailVerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailVerificationTokenUpdateInput, EmailVerificationTokenUncheckedUpdateInput>
  }

  /**
   * EmailVerificationToken delete
   */
  export type EmailVerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which EmailVerificationToken to delete.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken deleteMany
   */
  export type EmailVerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerificationTokens to delete
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * EmailVerificationToken without action
   */
  export type EmailVerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model PasswordChangeToken
   */

  export type AggregatePasswordChangeToken = {
    _count: PasswordChangeTokenCountAggregateOutputType | null
    _min: PasswordChangeTokenMinAggregateOutputType | null
    _max: PasswordChangeTokenMaxAggregateOutputType | null
  }

  export type PasswordChangeTokenMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
    email: string | null
  }

  export type PasswordChangeTokenMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
    email: string | null
  }

  export type PasswordChangeTokenCountAggregateOutputType = {
    id: number
    createdAt: number
    expiresAt: number
    email: number
    _all: number
  }


  export type PasswordChangeTokenMinAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
  }

  export type PasswordChangeTokenMaxAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
  }

  export type PasswordChangeTokenCountAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    email?: true
    _all?: true
  }

  export type PasswordChangeTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordChangeToken to aggregate.
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordChangeTokens to fetch.
     */
    orderBy?: PasswordChangeTokenOrderByWithRelationInput | PasswordChangeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordChangeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordChangeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordChangeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordChangeTokens
    **/
    _count?: true | PasswordChangeTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordChangeTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordChangeTokenMaxAggregateInputType
  }

  export type GetPasswordChangeTokenAggregateType<T extends PasswordChangeTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordChangeToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordChangeToken[P]>
      : GetScalarType<T[P], AggregatePasswordChangeToken[P]>
  }




  export type PasswordChangeTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordChangeTokenWhereInput
    orderBy?: PasswordChangeTokenOrderByWithAggregationInput | PasswordChangeTokenOrderByWithAggregationInput[]
    by: PasswordChangeTokenScalarFieldEnum[] | PasswordChangeTokenScalarFieldEnum
    having?: PasswordChangeTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordChangeTokenCountAggregateInputType | true
    _min?: PasswordChangeTokenMinAggregateInputType
    _max?: PasswordChangeTokenMaxAggregateInputType
  }

  export type PasswordChangeTokenGroupByOutputType = {
    id: string
    createdAt: Date
    expiresAt: Date
    email: string
    _count: PasswordChangeTokenCountAggregateOutputType | null
    _min: PasswordChangeTokenMinAggregateOutputType | null
    _max: PasswordChangeTokenMaxAggregateOutputType | null
  }

  type GetPasswordChangeTokenGroupByPayload<T extends PasswordChangeTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordChangeTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordChangeTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordChangeTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordChangeTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordChangeTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["passwordChangeToken"]>

  export type PasswordChangeTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["passwordChangeToken"]>

  export type PasswordChangeTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }, ExtArgs["result"]["passwordChangeToken"]>

  export type PasswordChangeTokenSelectScalar = {
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    email?: boolean
  }

  export type PasswordChangeTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "expiresAt" | "email", ExtArgs["result"]["passwordChangeToken"]>

  export type $PasswordChangeTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordChangeToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      expiresAt: Date
      email: string
    }, ExtArgs["result"]["passwordChangeToken"]>
    composites: {}
  }

  type PasswordChangeTokenGetPayload<S extends boolean | null | undefined | PasswordChangeTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordChangeTokenPayload, S>

  type PasswordChangeTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordChangeTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordChangeTokenCountAggregateInputType | true
    }

  export interface PasswordChangeTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordChangeToken'], meta: { name: 'PasswordChangeToken' } }
    /**
     * Find zero or one PasswordChangeToken that matches the filter.
     * @param {PasswordChangeTokenFindUniqueArgs} args - Arguments to find a PasswordChangeToken
     * @example
     * // Get one PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordChangeTokenFindUniqueArgs>(args: SelectSubset<T, PasswordChangeTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordChangeToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordChangeTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordChangeToken
     * @example
     * // Get one PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordChangeTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordChangeTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordChangeToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenFindFirstArgs} args - Arguments to find a PasswordChangeToken
     * @example
     * // Get one PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordChangeTokenFindFirstArgs>(args?: SelectSubset<T, PasswordChangeTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordChangeToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordChangeToken
     * @example
     * // Get one PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordChangeTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordChangeTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordChangeTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordChangeTokens
     * const passwordChangeTokens = await prisma.passwordChangeToken.findMany()
     * 
     * // Get first 10 PasswordChangeTokens
     * const passwordChangeTokens = await prisma.passwordChangeToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordChangeTokenWithIdOnly = await prisma.passwordChangeToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordChangeTokenFindManyArgs>(args?: SelectSubset<T, PasswordChangeTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordChangeToken.
     * @param {PasswordChangeTokenCreateArgs} args - Arguments to create a PasswordChangeToken.
     * @example
     * // Create one PasswordChangeToken
     * const PasswordChangeToken = await prisma.passwordChangeToken.create({
     *   data: {
     *     // ... data to create a PasswordChangeToken
     *   }
     * })
     * 
     */
    create<T extends PasswordChangeTokenCreateArgs>(args: SelectSubset<T, PasswordChangeTokenCreateArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordChangeTokens.
     * @param {PasswordChangeTokenCreateManyArgs} args - Arguments to create many PasswordChangeTokens.
     * @example
     * // Create many PasswordChangeTokens
     * const passwordChangeToken = await prisma.passwordChangeToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordChangeTokenCreateManyArgs>(args?: SelectSubset<T, PasswordChangeTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordChangeTokens and returns the data saved in the database.
     * @param {PasswordChangeTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordChangeTokens.
     * @example
     * // Create many PasswordChangeTokens
     * const passwordChangeToken = await prisma.passwordChangeToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordChangeTokens and only return the `id`
     * const passwordChangeTokenWithIdOnly = await prisma.passwordChangeToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordChangeTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordChangeTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordChangeToken.
     * @param {PasswordChangeTokenDeleteArgs} args - Arguments to delete one PasswordChangeToken.
     * @example
     * // Delete one PasswordChangeToken
     * const PasswordChangeToken = await prisma.passwordChangeToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordChangeToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordChangeTokenDeleteArgs>(args: SelectSubset<T, PasswordChangeTokenDeleteArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordChangeToken.
     * @param {PasswordChangeTokenUpdateArgs} args - Arguments to update one PasswordChangeToken.
     * @example
     * // Update one PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordChangeTokenUpdateArgs>(args: SelectSubset<T, PasswordChangeTokenUpdateArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordChangeTokens.
     * @param {PasswordChangeTokenDeleteManyArgs} args - Arguments to filter PasswordChangeTokens to delete.
     * @example
     * // Delete a few PasswordChangeTokens
     * const { count } = await prisma.passwordChangeToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordChangeTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordChangeTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordChangeTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordChangeTokens
     * const passwordChangeToken = await prisma.passwordChangeToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordChangeTokenUpdateManyArgs>(args: SelectSubset<T, PasswordChangeTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordChangeTokens and returns the data updated in the database.
     * @param {PasswordChangeTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordChangeTokens.
     * @example
     * // Update many PasswordChangeTokens
     * const passwordChangeToken = await prisma.passwordChangeToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordChangeTokens and only return the `id`
     * const passwordChangeTokenWithIdOnly = await prisma.passwordChangeToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordChangeTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordChangeTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordChangeToken.
     * @param {PasswordChangeTokenUpsertArgs} args - Arguments to update or create a PasswordChangeToken.
     * @example
     * // Update or create a PasswordChangeToken
     * const passwordChangeToken = await prisma.passwordChangeToken.upsert({
     *   create: {
     *     // ... data to create a PasswordChangeToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordChangeToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordChangeTokenUpsertArgs>(args: SelectSubset<T, PasswordChangeTokenUpsertArgs<ExtArgs>>): Prisma__PasswordChangeTokenClient<$Result.GetResult<Prisma.$PasswordChangeTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordChangeTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenCountArgs} args - Arguments to filter PasswordChangeTokens to count.
     * @example
     * // Count the number of PasswordChangeTokens
     * const count = await prisma.passwordChangeToken.count({
     *   where: {
     *     // ... the filter for the PasswordChangeTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordChangeTokenCountArgs>(
      args?: Subset<T, PasswordChangeTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordChangeTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordChangeToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordChangeTokenAggregateArgs>(args: Subset<T, PasswordChangeTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordChangeTokenAggregateType<T>>

    /**
     * Group by PasswordChangeToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordChangeTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordChangeTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordChangeTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordChangeTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordChangeTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordChangeTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordChangeToken model
   */
  readonly fields: PasswordChangeTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordChangeToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordChangeTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordChangeToken model
   */
  interface PasswordChangeTokenFieldRefs {
    readonly id: FieldRef<"PasswordChangeToken", 'String'>
    readonly createdAt: FieldRef<"PasswordChangeToken", 'DateTime'>
    readonly expiresAt: FieldRef<"PasswordChangeToken", 'DateTime'>
    readonly email: FieldRef<"PasswordChangeToken", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PasswordChangeToken findUnique
   */
  export type PasswordChangeTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordChangeToken to fetch.
     */
    where: PasswordChangeTokenWhereUniqueInput
  }

  /**
   * PasswordChangeToken findUniqueOrThrow
   */
  export type PasswordChangeTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordChangeToken to fetch.
     */
    where: PasswordChangeTokenWhereUniqueInput
  }

  /**
   * PasswordChangeToken findFirst
   */
  export type PasswordChangeTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordChangeToken to fetch.
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordChangeTokens to fetch.
     */
    orderBy?: PasswordChangeTokenOrderByWithRelationInput | PasswordChangeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordChangeTokens.
     */
    cursor?: PasswordChangeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordChangeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordChangeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordChangeTokens.
     */
    distinct?: PasswordChangeTokenScalarFieldEnum | PasswordChangeTokenScalarFieldEnum[]
  }

  /**
   * PasswordChangeToken findFirstOrThrow
   */
  export type PasswordChangeTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordChangeToken to fetch.
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordChangeTokens to fetch.
     */
    orderBy?: PasswordChangeTokenOrderByWithRelationInput | PasswordChangeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordChangeTokens.
     */
    cursor?: PasswordChangeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordChangeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordChangeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordChangeTokens.
     */
    distinct?: PasswordChangeTokenScalarFieldEnum | PasswordChangeTokenScalarFieldEnum[]
  }

  /**
   * PasswordChangeToken findMany
   */
  export type PasswordChangeTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter, which PasswordChangeTokens to fetch.
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordChangeTokens to fetch.
     */
    orderBy?: PasswordChangeTokenOrderByWithRelationInput | PasswordChangeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordChangeTokens.
     */
    cursor?: PasswordChangeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordChangeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordChangeTokens.
     */
    skip?: number
    distinct?: PasswordChangeTokenScalarFieldEnum | PasswordChangeTokenScalarFieldEnum[]
  }

  /**
   * PasswordChangeToken create
   */
  export type PasswordChangeTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a PasswordChangeToken.
     */
    data: XOR<PasswordChangeTokenCreateInput, PasswordChangeTokenUncheckedCreateInput>
  }

  /**
   * PasswordChangeToken createMany
   */
  export type PasswordChangeTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordChangeTokens.
     */
    data: PasswordChangeTokenCreateManyInput | PasswordChangeTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordChangeToken createManyAndReturn
   */
  export type PasswordChangeTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordChangeTokens.
     */
    data: PasswordChangeTokenCreateManyInput | PasswordChangeTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordChangeToken update
   */
  export type PasswordChangeTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a PasswordChangeToken.
     */
    data: XOR<PasswordChangeTokenUpdateInput, PasswordChangeTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordChangeToken to update.
     */
    where: PasswordChangeTokenWhereUniqueInput
  }

  /**
   * PasswordChangeToken updateMany
   */
  export type PasswordChangeTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordChangeTokens.
     */
    data: XOR<PasswordChangeTokenUpdateManyMutationInput, PasswordChangeTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordChangeTokens to update
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * Limit how many PasswordChangeTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordChangeToken updateManyAndReturn
   */
  export type PasswordChangeTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * The data used to update PasswordChangeTokens.
     */
    data: XOR<PasswordChangeTokenUpdateManyMutationInput, PasswordChangeTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordChangeTokens to update
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * Limit how many PasswordChangeTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordChangeToken upsert
   */
  export type PasswordChangeTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the PasswordChangeToken to update in case it exists.
     */
    where: PasswordChangeTokenWhereUniqueInput
    /**
     * In case the PasswordChangeToken found by the `where` argument doesn't exist, create a new PasswordChangeToken with this data.
     */
    create: XOR<PasswordChangeTokenCreateInput, PasswordChangeTokenUncheckedCreateInput>
    /**
     * In case the PasswordChangeToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordChangeTokenUpdateInput, PasswordChangeTokenUncheckedUpdateInput>
  }

  /**
   * PasswordChangeToken delete
   */
  export type PasswordChangeTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
    /**
     * Filter which PasswordChangeToken to delete.
     */
    where: PasswordChangeTokenWhereUniqueInput
  }

  /**
   * PasswordChangeToken deleteMany
   */
  export type PasswordChangeTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordChangeTokens to delete
     */
    where?: PasswordChangeTokenWhereInput
    /**
     * Limit how many PasswordChangeTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordChangeToken without action
   */
  export type PasswordChangeTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordChangeToken
     */
    select?: PasswordChangeTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordChangeToken
     */
    omit?: PasswordChangeTokenOmit<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    id: number | null
    openQuotaSize: number | null
  }

  export type EventSumAggregateOutputType = {
    id: number | null
    openQuotaSize: number | null
  }

  export type EventMinAggregateOutputType = {
    id: number | null
    title: string | null
    date: Date | null
    registrationStartDate: Date | null
    registrationEndDate: Date | null
    openQuotaSize: number | null
    description: string | null
    price: string | null
    location: string | null
    webpageUrl: string | null
    draft: boolean | null
    signupsPublic: boolean | null
    verificationEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    raffleEnabled: boolean | null
    raffleStartTime: Date | null
    raffleEndTime: Date | null
    raffleStatus: $Enums.RaffleStatus | null
  }

  export type EventMaxAggregateOutputType = {
    id: number | null
    title: string | null
    date: Date | null
    registrationStartDate: Date | null
    registrationEndDate: Date | null
    openQuotaSize: number | null
    description: string | null
    price: string | null
    location: string | null
    webpageUrl: string | null
    draft: boolean | null
    signupsPublic: boolean | null
    verificationEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    raffleEnabled: boolean | null
    raffleStartTime: Date | null
    raffleEndTime: Date | null
    raffleStatus: $Enums.RaffleStatus | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    date: number
    registrationStartDate: number
    registrationEndDate: number
    openQuotaSize: number
    description: number
    price: number
    location: number
    webpageUrl: number
    draft: number
    signupsPublic: number
    verificationEmail: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    raffleEnabled: number
    raffleStartTime: number
    raffleEndTime: number
    raffleStatus: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    id?: true
    openQuotaSize?: true
  }

  export type EventSumAggregateInputType = {
    id?: true
    openQuotaSize?: true
  }

  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    date?: true
    registrationStartDate?: true
    registrationEndDate?: true
    openQuotaSize?: true
    description?: true
    price?: true
    location?: true
    webpageUrl?: true
    draft?: true
    signupsPublic?: true
    verificationEmail?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    raffleEnabled?: true
    raffleStartTime?: true
    raffleEndTime?: true
    raffleStatus?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    date?: true
    registrationStartDate?: true
    registrationEndDate?: true
    openQuotaSize?: true
    description?: true
    price?: true
    location?: true
    webpageUrl?: true
    draft?: true
    signupsPublic?: true
    verificationEmail?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    raffleEnabled?: true
    raffleStartTime?: true
    raffleEndTime?: true
    raffleStatus?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    date?: true
    registrationStartDate?: true
    registrationEndDate?: true
    openQuotaSize?: true
    description?: true
    price?: true
    location?: true
    webpageUrl?: true
    draft?: true
    signupsPublic?: true
    verificationEmail?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    raffleEnabled?: true
    raffleStartTime?: true
    raffleEndTime?: true
    raffleStatus?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: number
    title: string
    date: Date
    registrationStartDate: Date
    registrationEndDate: Date
    openQuotaSize: number
    description: string | null
    price: string | null
    location: string | null
    webpageUrl: string | null
    draft: boolean
    signupsPublic: boolean
    verificationEmail: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    raffleEnabled: boolean
    raffleStartTime: Date | null
    raffleEndTime: Date | null
    raffleStatus: $Enums.RaffleStatus
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    openQuotaSize?: boolean
    description?: boolean
    price?: boolean
    location?: boolean
    webpageUrl?: boolean
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    raffleEnabled?: boolean
    raffleStartTime?: boolean
    raffleEndTime?: boolean
    raffleStatus?: boolean
    Questions?: boolean | Event$QuestionsArgs<ExtArgs>
    Quotas?: boolean | Event$QuotasArgs<ExtArgs>
    raffleSimulations?: boolean | Event$raffleSimulationsArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    openQuotaSize?: boolean
    description?: boolean
    price?: boolean
    location?: boolean
    webpageUrl?: boolean
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    raffleEnabled?: boolean
    raffleStartTime?: boolean
    raffleEndTime?: boolean
    raffleStatus?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    openQuotaSize?: boolean
    description?: boolean
    price?: boolean
    location?: boolean
    webpageUrl?: boolean
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    raffleEnabled?: boolean
    raffleStartTime?: boolean
    raffleEndTime?: boolean
    raffleStatus?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    date?: boolean
    registrationStartDate?: boolean
    registrationEndDate?: boolean
    openQuotaSize?: boolean
    description?: boolean
    price?: boolean
    location?: boolean
    webpageUrl?: boolean
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    raffleEnabled?: boolean
    raffleStartTime?: boolean
    raffleEndTime?: boolean
    raffleStatus?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "date" | "registrationStartDate" | "registrationEndDate" | "openQuotaSize" | "description" | "price" | "location" | "webpageUrl" | "draft" | "signupsPublic" | "verificationEmail" | "createdAt" | "updatedAt" | "deletedAt" | "raffleEnabled" | "raffleStartTime" | "raffleEndTime" | "raffleStatus", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Questions?: boolean | Event$QuestionsArgs<ExtArgs>
    Quotas?: boolean | Event$QuotasArgs<ExtArgs>
    raffleSimulations?: boolean | Event$raffleSimulationsArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      Questions: Prisma.$QuestionPayload<ExtArgs>[]
      Quotas: Prisma.$QuotaPayload<ExtArgs>[]
      raffleSimulations: Prisma.$RaffleSimulationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      date: Date
      registrationStartDate: Date
      registrationEndDate: Date
      openQuotaSize: number
      description: string | null
      price: string | null
      location: string | null
      webpageUrl: string | null
      draft: boolean
      signupsPublic: boolean
      verificationEmail: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      raffleEnabled: boolean
      raffleStartTime: Date | null
      raffleEndTime: Date | null
      raffleStatus: $Enums.RaffleStatus
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Questions<T extends Event$QuestionsArgs<ExtArgs> = {}>(args?: Subset<T, Event$QuestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Quotas<T extends Event$QuotasArgs<ExtArgs> = {}>(args?: Subset<T, Event$QuotasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    raffleSimulations<T extends Event$raffleSimulationsArgs<ExtArgs> = {}>(args?: Subset<T, Event$raffleSimulationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'Int'>
    readonly title: FieldRef<"Event", 'String'>
    readonly date: FieldRef<"Event", 'DateTime'>
    readonly registrationStartDate: FieldRef<"Event", 'DateTime'>
    readonly registrationEndDate: FieldRef<"Event", 'DateTime'>
    readonly openQuotaSize: FieldRef<"Event", 'Int'>
    readonly description: FieldRef<"Event", 'String'>
    readonly price: FieldRef<"Event", 'String'>
    readonly location: FieldRef<"Event", 'String'>
    readonly webpageUrl: FieldRef<"Event", 'String'>
    readonly draft: FieldRef<"Event", 'Boolean'>
    readonly signupsPublic: FieldRef<"Event", 'Boolean'>
    readonly verificationEmail: FieldRef<"Event", 'String'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
    readonly deletedAt: FieldRef<"Event", 'DateTime'>
    readonly raffleEnabled: FieldRef<"Event", 'Boolean'>
    readonly raffleStartTime: FieldRef<"Event", 'DateTime'>
    readonly raffleEndTime: FieldRef<"Event", 'DateTime'>
    readonly raffleStatus: FieldRef<"Event", 'RaffleStatus'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.Questions
   */
  export type Event$QuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    cursor?: QuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Event.Quotas
   */
  export type Event$QuotasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    where?: QuotaWhereInput
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    cursor?: QuotaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Event.raffleSimulations
   */
  export type Event$raffleSimulationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    where?: RaffleSimulationWhereInput
    orderBy?: RaffleSimulationOrderByWithRelationInput | RaffleSimulationOrderByWithRelationInput[]
    cursor?: RaffleSimulationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RaffleSimulationScalarFieldEnum | RaffleSimulationScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionAvgAggregateOutputType = {
    sortId: number | null
    eventId: number | null
  }

  export type QuestionSumAggregateOutputType = {
    sortId: number | null
    eventId: number | null
  }

  export type QuestionMinAggregateOutputType = {
    id: string | null
    question: string | null
    type: $Enums.QuestionType | null
    sortId: number | null
    required: boolean | null
    public: boolean | null
    eventId: number | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: string | null
    question: string | null
    type: $Enums.QuestionType | null
    sortId: number | null
    required: boolean | null
    public: boolean | null
    eventId: number | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    question: number
    type: number
    sortId: number
    options: number
    required: number
    public: number
    eventId: number
    _all: number
  }


  export type QuestionAvgAggregateInputType = {
    sortId?: true
    eventId?: true
  }

  export type QuestionSumAggregateInputType = {
    sortId?: true
    eventId?: true
  }

  export type QuestionMinAggregateInputType = {
    id?: true
    question?: true
    type?: true
    sortId?: true
    required?: true
    public?: true
    eventId?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    question?: true
    type?: true
    sortId?: true
    required?: true
    public?: true
    eventId?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    question?: true
    type?: true
    sortId?: true
    options?: true
    required?: true
    public?: true
    eventId?: true
    _all?: true
  }

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _avg?: QuestionAvgAggregateInputType
    _sum?: QuestionSumAggregateInputType
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
    id: string
    question: string
    type: $Enums.QuestionType
    sortId: number
    options: string[]
    required: boolean
    public: boolean
    eventId: number
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    type?: boolean
    sortId?: boolean
    options?: boolean
    required?: boolean
    public?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
    Answers?: boolean | Question$AnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    type?: boolean
    sortId?: boolean
    options?: boolean
    required?: boolean
    public?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    type?: boolean
    sortId?: boolean
    options?: boolean
    required?: boolean
    public?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    question?: boolean
    type?: boolean
    sortId?: boolean
    options?: boolean
    required?: boolean
    public?: boolean
    eventId?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "type" | "sortId" | "options" | "required" | "public" | "eventId", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
    Answers?: boolean | Question$AnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      Event: Prisma.$EventPayload<ExtArgs>
      Answers: Prisma.$AnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question: string
      type: $Enums.QuestionType
      sortId: number
      options: string[]
      required: boolean
      public: boolean
      eventId: number
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Answers<T extends Question$AnswersArgs<ExtArgs> = {}>(args?: Subset<T, Question$AnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'String'>
    readonly question: FieldRef<"Question", 'String'>
    readonly type: FieldRef<"Question", 'QuestionType'>
    readonly sortId: FieldRef<"Question", 'Int'>
    readonly options: FieldRef<"Question", 'String[]'>
    readonly required: FieldRef<"Question", 'Boolean'>
    readonly public: FieldRef<"Question", 'Boolean'>
    readonly eventId: FieldRef<"Question", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question.Answers
   */
  export type Question$AnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    where?: AnswerWhereInput
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    cursor?: AnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnswerScalarFieldEnum | AnswerScalarFieldEnum[]
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
  }


  /**
   * Model Answer
   */

  export type AggregateAnswer = {
    _count: AnswerCountAggregateOutputType | null
    _min: AnswerMinAggregateOutputType | null
    _max: AnswerMaxAggregateOutputType | null
  }

  export type AnswerMinAggregateOutputType = {
    id: string | null
    answer: string | null
    questionId: string | null
    signupId: string | null
  }

  export type AnswerMaxAggregateOutputType = {
    id: string | null
    answer: string | null
    questionId: string | null
    signupId: string | null
  }

  export type AnswerCountAggregateOutputType = {
    id: number
    answer: number
    questionId: number
    signupId: number
    _all: number
  }


  export type AnswerMinAggregateInputType = {
    id?: true
    answer?: true
    questionId?: true
    signupId?: true
  }

  export type AnswerMaxAggregateInputType = {
    id?: true
    answer?: true
    questionId?: true
    signupId?: true
  }

  export type AnswerCountAggregateInputType = {
    id?: true
    answer?: true
    questionId?: true
    signupId?: true
    _all?: true
  }

  export type AnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Answer to aggregate.
     */
    where?: AnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Answers
    **/
    _count?: true | AnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnswerMaxAggregateInputType
  }

  export type GetAnswerAggregateType<T extends AnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnswer[P]>
      : GetScalarType<T[P], AggregateAnswer[P]>
  }




  export type AnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnswerWhereInput
    orderBy?: AnswerOrderByWithAggregationInput | AnswerOrderByWithAggregationInput[]
    by: AnswerScalarFieldEnum[] | AnswerScalarFieldEnum
    having?: AnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnswerCountAggregateInputType | true
    _min?: AnswerMinAggregateInputType
    _max?: AnswerMaxAggregateInputType
  }

  export type AnswerGroupByOutputType = {
    id: string
    answer: string
    questionId: string
    signupId: string
    _count: AnswerCountAggregateOutputType | null
    _min: AnswerMinAggregateOutputType | null
    _max: AnswerMaxAggregateOutputType | null
  }

  type GetAnswerGroupByPayload<T extends AnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnswerGroupByOutputType[P]>
            : GetScalarType<T[P], AnswerGroupByOutputType[P]>
        }
      >
    >


  export type AnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    answer?: boolean
    questionId?: boolean
    signupId?: boolean
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answer"]>

  export type AnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    answer?: boolean
    questionId?: boolean
    signupId?: boolean
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answer"]>

  export type AnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    answer?: boolean
    questionId?: boolean
    signupId?: boolean
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answer"]>

  export type AnswerSelectScalar = {
    id?: boolean
    answer?: boolean
    questionId?: boolean
    signupId?: boolean
  }

  export type AnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "answer" | "questionId" | "signupId", ExtArgs["result"]["answer"]>
  export type AnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }
  export type AnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }
  export type AnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Question?: boolean | QuestionDefaultArgs<ExtArgs>
    Signup?: boolean | SignupDefaultArgs<ExtArgs>
  }

  export type $AnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Answer"
    objects: {
      Question: Prisma.$QuestionPayload<ExtArgs>
      Signup: Prisma.$SignupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      answer: string
      questionId: string
      signupId: string
    }, ExtArgs["result"]["answer"]>
    composites: {}
  }

  type AnswerGetPayload<S extends boolean | null | undefined | AnswerDefaultArgs> = $Result.GetResult<Prisma.$AnswerPayload, S>

  type AnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnswerCountAggregateInputType | true
    }

  export interface AnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Answer'], meta: { name: 'Answer' } }
    /**
     * Find zero or one Answer that matches the filter.
     * @param {AnswerFindUniqueArgs} args - Arguments to find a Answer
     * @example
     * // Get one Answer
     * const answer = await prisma.answer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnswerFindUniqueArgs>(args: SelectSubset<T, AnswerFindUniqueArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Answer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnswerFindUniqueOrThrowArgs} args - Arguments to find a Answer
     * @example
     * // Get one Answer
     * const answer = await prisma.answer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, AnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerFindFirstArgs} args - Arguments to find a Answer
     * @example
     * // Get one Answer
     * const answer = await prisma.answer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnswerFindFirstArgs>(args?: SelectSubset<T, AnswerFindFirstArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerFindFirstOrThrowArgs} args - Arguments to find a Answer
     * @example
     * // Get one Answer
     * const answer = await prisma.answer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, AnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Answers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Answers
     * const answers = await prisma.answer.findMany()
     * 
     * // Get first 10 Answers
     * const answers = await prisma.answer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const answerWithIdOnly = await prisma.answer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnswerFindManyArgs>(args?: SelectSubset<T, AnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Answer.
     * @param {AnswerCreateArgs} args - Arguments to create a Answer.
     * @example
     * // Create one Answer
     * const Answer = await prisma.answer.create({
     *   data: {
     *     // ... data to create a Answer
     *   }
     * })
     * 
     */
    create<T extends AnswerCreateArgs>(args: SelectSubset<T, AnswerCreateArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Answers.
     * @param {AnswerCreateManyArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answer = await prisma.answer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnswerCreateManyArgs>(args?: SelectSubset<T, AnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Answers and returns the data saved in the database.
     * @param {AnswerCreateManyAndReturnArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answer = await prisma.answer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Answers and only return the `id`
     * const answerWithIdOnly = await prisma.answer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, AnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Answer.
     * @param {AnswerDeleteArgs} args - Arguments to delete one Answer.
     * @example
     * // Delete one Answer
     * const Answer = await prisma.answer.delete({
     *   where: {
     *     // ... filter to delete one Answer
     *   }
     * })
     * 
     */
    delete<T extends AnswerDeleteArgs>(args: SelectSubset<T, AnswerDeleteArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Answer.
     * @param {AnswerUpdateArgs} args - Arguments to update one Answer.
     * @example
     * // Update one Answer
     * const answer = await prisma.answer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnswerUpdateArgs>(args: SelectSubset<T, AnswerUpdateArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Answers.
     * @param {AnswerDeleteManyArgs} args - Arguments to filter Answers to delete.
     * @example
     * // Delete a few Answers
     * const { count } = await prisma.answer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnswerDeleteManyArgs>(args?: SelectSubset<T, AnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Answers
     * const answer = await prisma.answer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnswerUpdateManyArgs>(args: SelectSubset<T, AnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers and returns the data updated in the database.
     * @param {AnswerUpdateManyAndReturnArgs} args - Arguments to update many Answers.
     * @example
     * // Update many Answers
     * const answer = await prisma.answer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Answers and only return the `id`
     * const answerWithIdOnly = await prisma.answer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, AnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Answer.
     * @param {AnswerUpsertArgs} args - Arguments to update or create a Answer.
     * @example
     * // Update or create a Answer
     * const answer = await prisma.answer.upsert({
     *   create: {
     *     // ... data to create a Answer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Answer we want to update
     *   }
     * })
     */
    upsert<T extends AnswerUpsertArgs>(args: SelectSubset<T, AnswerUpsertArgs<ExtArgs>>): Prisma__AnswerClient<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerCountArgs} args - Arguments to filter Answers to count.
     * @example
     * // Count the number of Answers
     * const count = await prisma.answer.count({
     *   where: {
     *     // ... the filter for the Answers we want to count
     *   }
     * })
    **/
    count<T extends AnswerCountArgs>(
      args?: Subset<T, AnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Answer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnswerAggregateArgs>(args: Subset<T, AnswerAggregateArgs>): Prisma.PrismaPromise<GetAnswerAggregateType<T>>

    /**
     * Group by Answer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnswerGroupByArgs['orderBy'] }
        : { orderBy?: AnswerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Answer model
   */
  readonly fields: AnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Answer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Question<T extends QuestionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionDefaultArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Signup<T extends SignupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SignupDefaultArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Answer model
   */
  interface AnswerFieldRefs {
    readonly id: FieldRef<"Answer", 'String'>
    readonly answer: FieldRef<"Answer", 'String'>
    readonly questionId: FieldRef<"Answer", 'String'>
    readonly signupId: FieldRef<"Answer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Answer findUnique
   */
  export type AnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter, which Answer to fetch.
     */
    where: AnswerWhereUniqueInput
  }

  /**
   * Answer findUniqueOrThrow
   */
  export type AnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter, which Answer to fetch.
     */
    where: AnswerWhereUniqueInput
  }

  /**
   * Answer findFirst
   */
  export type AnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter, which Answer to fetch.
     */
    where?: AnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Answers.
     */
    cursor?: AnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Answers.
     */
    distinct?: AnswerScalarFieldEnum | AnswerScalarFieldEnum[]
  }

  /**
   * Answer findFirstOrThrow
   */
  export type AnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter, which Answer to fetch.
     */
    where?: AnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Answers.
     */
    cursor?: AnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Answers.
     */
    distinct?: AnswerScalarFieldEnum | AnswerScalarFieldEnum[]
  }

  /**
   * Answer findMany
   */
  export type AnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where?: AnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Answers.
     */
    cursor?: AnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    distinct?: AnswerScalarFieldEnum | AnswerScalarFieldEnum[]
  }

  /**
   * Answer create
   */
  export type AnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a Answer.
     */
    data: XOR<AnswerCreateInput, AnswerUncheckedCreateInput>
  }

  /**
   * Answer createMany
   */
  export type AnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Answers.
     */
    data: AnswerCreateManyInput | AnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Answer createManyAndReturn
   */
  export type AnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * The data used to create many Answers.
     */
    data: AnswerCreateManyInput | AnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Answer update
   */
  export type AnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a Answer.
     */
    data: XOR<AnswerUpdateInput, AnswerUncheckedUpdateInput>
    /**
     * Choose, which Answer to update.
     */
    where: AnswerWhereUniqueInput
  }

  /**
   * Answer updateMany
   */
  export type AnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Answers.
     */
    data: XOR<AnswerUpdateManyMutationInput, AnswerUncheckedUpdateManyInput>
    /**
     * Filter which Answers to update
     */
    where?: AnswerWhereInput
    /**
     * Limit how many Answers to update.
     */
    limit?: number
  }

  /**
   * Answer updateManyAndReturn
   */
  export type AnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * The data used to update Answers.
     */
    data: XOR<AnswerUpdateManyMutationInput, AnswerUncheckedUpdateManyInput>
    /**
     * Filter which Answers to update
     */
    where?: AnswerWhereInput
    /**
     * Limit how many Answers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Answer upsert
   */
  export type AnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the Answer to update in case it exists.
     */
    where: AnswerWhereUniqueInput
    /**
     * In case the Answer found by the `where` argument doesn't exist, create a new Answer with this data.
     */
    create: XOR<AnswerCreateInput, AnswerUncheckedCreateInput>
    /**
     * In case the Answer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnswerUpdateInput, AnswerUncheckedUpdateInput>
  }

  /**
   * Answer delete
   */
  export type AnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    /**
     * Filter which Answer to delete.
     */
    where: AnswerWhereUniqueInput
  }

  /**
   * Answer deleteMany
   */
  export type AnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Answers to delete
     */
    where?: AnswerWhereInput
    /**
     * Limit how many Answers to delete.
     */
    limit?: number
  }

  /**
   * Answer without action
   */
  export type AnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
  }


  /**
   * Model Signup
   */

  export type AggregateSignup = {
    _count: SignupCountAggregateOutputType | null
    _min: SignupMinAggregateOutputType | null
    _max: SignupMaxAggregateOutputType | null
  }

  export type SignupMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    completedAt: Date | null
    createdAt: Date | null
    quotaId: string | null
    originalQuotaId: string | null
    registrationIntent: Date | null
    status: $Enums.SignupStatus | null
  }

  export type SignupMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    completedAt: Date | null
    createdAt: Date | null
    quotaId: string | null
    originalQuotaId: string | null
    registrationIntent: Date | null
    status: $Enums.SignupStatus | null
  }

  export type SignupCountAggregateOutputType = {
    id: number
    name: number
    email: number
    completedAt: number
    createdAt: number
    quotaId: number
    originalQuotaId: number
    registrationIntent: number
    status: number
    _all: number
  }


  export type SignupMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    completedAt?: true
    createdAt?: true
    quotaId?: true
    originalQuotaId?: true
    registrationIntent?: true
    status?: true
  }

  export type SignupMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    completedAt?: true
    createdAt?: true
    quotaId?: true
    originalQuotaId?: true
    registrationIntent?: true
    status?: true
  }

  export type SignupCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    completedAt?: true
    createdAt?: true
    quotaId?: true
    originalQuotaId?: true
    registrationIntent?: true
    status?: true
    _all?: true
  }

  export type SignupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signup to aggregate.
     */
    where?: SignupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signups to fetch.
     */
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SignupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Signups
    **/
    _count?: true | SignupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignupMaxAggregateInputType
  }

  export type GetSignupAggregateType<T extends SignupAggregateArgs> = {
        [P in keyof T & keyof AggregateSignup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignup[P]>
      : GetScalarType<T[P], AggregateSignup[P]>
  }




  export type SignupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignupWhereInput
    orderBy?: SignupOrderByWithAggregationInput | SignupOrderByWithAggregationInput[]
    by: SignupScalarFieldEnum[] | SignupScalarFieldEnum
    having?: SignupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignupCountAggregateInputType | true
    _min?: SignupMinAggregateInputType
    _max?: SignupMaxAggregateInputType
  }

  export type SignupGroupByOutputType = {
    id: string
    name: string
    email: string
    completedAt: Date | null
    createdAt: Date
    quotaId: string
    originalQuotaId: string
    registrationIntent: Date | null
    status: $Enums.SignupStatus
    _count: SignupCountAggregateOutputType | null
    _min: SignupMinAggregateOutputType | null
    _max: SignupMaxAggregateOutputType | null
  }

  type GetSignupGroupByPayload<T extends SignupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignupGroupByOutputType[P]>
            : GetScalarType<T[P], SignupGroupByOutputType[P]>
        }
      >
    >


  export type SignupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    completedAt?: boolean
    createdAt?: boolean
    quotaId?: boolean
    originalQuotaId?: boolean
    registrationIntent?: boolean
    status?: boolean
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
    Answers?: boolean | Signup$AnswersArgs<ExtArgs>
    _count?: boolean | SignupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signup"]>

  export type SignupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    completedAt?: boolean
    createdAt?: boolean
    quotaId?: boolean
    originalQuotaId?: boolean
    registrationIntent?: boolean
    status?: boolean
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signup"]>

  export type SignupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    completedAt?: boolean
    createdAt?: boolean
    quotaId?: boolean
    originalQuotaId?: boolean
    registrationIntent?: boolean
    status?: boolean
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["signup"]>

  export type SignupSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    completedAt?: boolean
    createdAt?: boolean
    quotaId?: boolean
    originalQuotaId?: boolean
    registrationIntent?: boolean
    status?: boolean
  }

  export type SignupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "completedAt" | "createdAt" | "quotaId" | "originalQuotaId" | "registrationIntent" | "status", ExtArgs["result"]["signup"]>
  export type SignupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
    Answers?: boolean | Signup$AnswersArgs<ExtArgs>
    _count?: boolean | SignupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SignupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
  }
  export type SignupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Quota?: boolean | QuotaDefaultArgs<ExtArgs>
    OriginalQuota?: boolean | QuotaDefaultArgs<ExtArgs>
  }

  export type $SignupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Signup"
    objects: {
      Quota: Prisma.$QuotaPayload<ExtArgs>
      OriginalQuota: Prisma.$QuotaPayload<ExtArgs>
      Answers: Prisma.$AnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      completedAt: Date | null
      createdAt: Date
      quotaId: string
      originalQuotaId: string
      registrationIntent: Date | null
      status: $Enums.SignupStatus
    }, ExtArgs["result"]["signup"]>
    composites: {}
  }

  type SignupGetPayload<S extends boolean | null | undefined | SignupDefaultArgs> = $Result.GetResult<Prisma.$SignupPayload, S>

  type SignupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SignupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SignupCountAggregateInputType | true
    }

  export interface SignupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Signup'], meta: { name: 'Signup' } }
    /**
     * Find zero or one Signup that matches the filter.
     * @param {SignupFindUniqueArgs} args - Arguments to find a Signup
     * @example
     * // Get one Signup
     * const signup = await prisma.signup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SignupFindUniqueArgs>(args: SelectSubset<T, SignupFindUniqueArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Signup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SignupFindUniqueOrThrowArgs} args - Arguments to find a Signup
     * @example
     * // Get one Signup
     * const signup = await prisma.signup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SignupFindUniqueOrThrowArgs>(args: SelectSubset<T, SignupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Signup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupFindFirstArgs} args - Arguments to find a Signup
     * @example
     * // Get one Signup
     * const signup = await prisma.signup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SignupFindFirstArgs>(args?: SelectSubset<T, SignupFindFirstArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Signup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupFindFirstOrThrowArgs} args - Arguments to find a Signup
     * @example
     * // Get one Signup
     * const signup = await prisma.signup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SignupFindFirstOrThrowArgs>(args?: SelectSubset<T, SignupFindFirstOrThrowArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Signups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Signups
     * const signups = await prisma.signup.findMany()
     * 
     * // Get first 10 Signups
     * const signups = await prisma.signup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const signupWithIdOnly = await prisma.signup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SignupFindManyArgs>(args?: SelectSubset<T, SignupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Signup.
     * @param {SignupCreateArgs} args - Arguments to create a Signup.
     * @example
     * // Create one Signup
     * const Signup = await prisma.signup.create({
     *   data: {
     *     // ... data to create a Signup
     *   }
     * })
     * 
     */
    create<T extends SignupCreateArgs>(args: SelectSubset<T, SignupCreateArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Signups.
     * @param {SignupCreateManyArgs} args - Arguments to create many Signups.
     * @example
     * // Create many Signups
     * const signup = await prisma.signup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SignupCreateManyArgs>(args?: SelectSubset<T, SignupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Signups and returns the data saved in the database.
     * @param {SignupCreateManyAndReturnArgs} args - Arguments to create many Signups.
     * @example
     * // Create many Signups
     * const signup = await prisma.signup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Signups and only return the `id`
     * const signupWithIdOnly = await prisma.signup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SignupCreateManyAndReturnArgs>(args?: SelectSubset<T, SignupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Signup.
     * @param {SignupDeleteArgs} args - Arguments to delete one Signup.
     * @example
     * // Delete one Signup
     * const Signup = await prisma.signup.delete({
     *   where: {
     *     // ... filter to delete one Signup
     *   }
     * })
     * 
     */
    delete<T extends SignupDeleteArgs>(args: SelectSubset<T, SignupDeleteArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Signup.
     * @param {SignupUpdateArgs} args - Arguments to update one Signup.
     * @example
     * // Update one Signup
     * const signup = await prisma.signup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SignupUpdateArgs>(args: SelectSubset<T, SignupUpdateArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Signups.
     * @param {SignupDeleteManyArgs} args - Arguments to filter Signups to delete.
     * @example
     * // Delete a few Signups
     * const { count } = await prisma.signup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SignupDeleteManyArgs>(args?: SelectSubset<T, SignupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Signups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Signups
     * const signup = await prisma.signup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SignupUpdateManyArgs>(args: SelectSubset<T, SignupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Signups and returns the data updated in the database.
     * @param {SignupUpdateManyAndReturnArgs} args - Arguments to update many Signups.
     * @example
     * // Update many Signups
     * const signup = await prisma.signup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Signups and only return the `id`
     * const signupWithIdOnly = await prisma.signup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SignupUpdateManyAndReturnArgs>(args: SelectSubset<T, SignupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Signup.
     * @param {SignupUpsertArgs} args - Arguments to update or create a Signup.
     * @example
     * // Update or create a Signup
     * const signup = await prisma.signup.upsert({
     *   create: {
     *     // ... data to create a Signup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Signup we want to update
     *   }
     * })
     */
    upsert<T extends SignupUpsertArgs>(args: SelectSubset<T, SignupUpsertArgs<ExtArgs>>): Prisma__SignupClient<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Signups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupCountArgs} args - Arguments to filter Signups to count.
     * @example
     * // Count the number of Signups
     * const count = await prisma.signup.count({
     *   where: {
     *     // ... the filter for the Signups we want to count
     *   }
     * })
    **/
    count<T extends SignupCountArgs>(
      args?: Subset<T, SignupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Signup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignupAggregateArgs>(args: Subset<T, SignupAggregateArgs>): Prisma.PrismaPromise<GetSignupAggregateType<T>>

    /**
     * Group by Signup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SignupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SignupGroupByArgs['orderBy'] }
        : { orderBy?: SignupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SignupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Signup model
   */
  readonly fields: SignupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Signup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SignupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Quota<T extends QuotaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuotaDefaultArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    OriginalQuota<T extends QuotaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuotaDefaultArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Answers<T extends Signup$AnswersArgs<ExtArgs> = {}>(args?: Subset<T, Signup$AnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Signup model
   */
  interface SignupFieldRefs {
    readonly id: FieldRef<"Signup", 'String'>
    readonly name: FieldRef<"Signup", 'String'>
    readonly email: FieldRef<"Signup", 'String'>
    readonly completedAt: FieldRef<"Signup", 'DateTime'>
    readonly createdAt: FieldRef<"Signup", 'DateTime'>
    readonly quotaId: FieldRef<"Signup", 'String'>
    readonly originalQuotaId: FieldRef<"Signup", 'String'>
    readonly registrationIntent: FieldRef<"Signup", 'DateTime'>
    readonly status: FieldRef<"Signup", 'SignupStatus'>
  }
    

  // Custom InputTypes
  /**
   * Signup findUnique
   */
  export type SignupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter, which Signup to fetch.
     */
    where: SignupWhereUniqueInput
  }

  /**
   * Signup findUniqueOrThrow
   */
  export type SignupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter, which Signup to fetch.
     */
    where: SignupWhereUniqueInput
  }

  /**
   * Signup findFirst
   */
  export type SignupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter, which Signup to fetch.
     */
    where?: SignupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signups to fetch.
     */
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signups.
     */
    cursor?: SignupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signups.
     */
    distinct?: SignupScalarFieldEnum | SignupScalarFieldEnum[]
  }

  /**
   * Signup findFirstOrThrow
   */
  export type SignupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter, which Signup to fetch.
     */
    where?: SignupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signups to fetch.
     */
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Signups.
     */
    cursor?: SignupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Signups.
     */
    distinct?: SignupScalarFieldEnum | SignupScalarFieldEnum[]
  }

  /**
   * Signup findMany
   */
  export type SignupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter, which Signups to fetch.
     */
    where?: SignupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Signups to fetch.
     */
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Signups.
     */
    cursor?: SignupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Signups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Signups.
     */
    skip?: number
    distinct?: SignupScalarFieldEnum | SignupScalarFieldEnum[]
  }

  /**
   * Signup create
   */
  export type SignupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * The data needed to create a Signup.
     */
    data: XOR<SignupCreateInput, SignupUncheckedCreateInput>
  }

  /**
   * Signup createMany
   */
  export type SignupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Signups.
     */
    data: SignupCreateManyInput | SignupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Signup createManyAndReturn
   */
  export type SignupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * The data used to create many Signups.
     */
    data: SignupCreateManyInput | SignupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Signup update
   */
  export type SignupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * The data needed to update a Signup.
     */
    data: XOR<SignupUpdateInput, SignupUncheckedUpdateInput>
    /**
     * Choose, which Signup to update.
     */
    where: SignupWhereUniqueInput
  }

  /**
   * Signup updateMany
   */
  export type SignupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Signups.
     */
    data: XOR<SignupUpdateManyMutationInput, SignupUncheckedUpdateManyInput>
    /**
     * Filter which Signups to update
     */
    where?: SignupWhereInput
    /**
     * Limit how many Signups to update.
     */
    limit?: number
  }

  /**
   * Signup updateManyAndReturn
   */
  export type SignupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * The data used to update Signups.
     */
    data: XOR<SignupUpdateManyMutationInput, SignupUncheckedUpdateManyInput>
    /**
     * Filter which Signups to update
     */
    where?: SignupWhereInput
    /**
     * Limit how many Signups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Signup upsert
   */
  export type SignupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * The filter to search for the Signup to update in case it exists.
     */
    where: SignupWhereUniqueInput
    /**
     * In case the Signup found by the `where` argument doesn't exist, create a new Signup with this data.
     */
    create: XOR<SignupCreateInput, SignupUncheckedCreateInput>
    /**
     * In case the Signup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SignupUpdateInput, SignupUncheckedUpdateInput>
  }

  /**
   * Signup delete
   */
  export type SignupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    /**
     * Filter which Signup to delete.
     */
    where: SignupWhereUniqueInput
  }

  /**
   * Signup deleteMany
   */
  export type SignupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Signups to delete
     */
    where?: SignupWhereInput
    /**
     * Limit how many Signups to delete.
     */
    limit?: number
  }

  /**
   * Signup.Answers
   */
  export type Signup$AnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answer
     */
    select?: AnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answer
     */
    omit?: AnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswerInclude<ExtArgs> | null
    where?: AnswerWhereInput
    orderBy?: AnswerOrderByWithRelationInput | AnswerOrderByWithRelationInput[]
    cursor?: AnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnswerScalarFieldEnum | AnswerScalarFieldEnum[]
  }

  /**
   * Signup without action
   */
  export type SignupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
  }


  /**
   * Model RaffleSimulation
   */

  export type AggregateRaffleSimulation = {
    _count: RaffleSimulationCountAggregateOutputType | null
    _avg: RaffleSimulationAvgAggregateOutputType | null
    _sum: RaffleSimulationSumAggregateOutputType | null
    _min: RaffleSimulationMinAggregateOutputType | null
    _max: RaffleSimulationMaxAggregateOutputType | null
  }

  export type RaffleSimulationAvgAggregateOutputType = {
    eventId: number | null
  }

  export type RaffleSimulationSumAggregateOutputType = {
    eventId: number | null
  }

  export type RaffleSimulationMinAggregateOutputType = {
    id: string | null
    eventId: number | null
    seed: string | null
    startTime: Date | null
    endTime: Date | null
    createdAt: Date | null
  }

  export type RaffleSimulationMaxAggregateOutputType = {
    id: string | null
    eventId: number | null
    seed: string | null
    startTime: Date | null
    endTime: Date | null
    createdAt: Date | null
  }

  export type RaffleSimulationCountAggregateOutputType = {
    id: number
    eventId: number
    seed: number
    startTime: number
    endTime: number
    physicsState: number
    createdAt: number
    _all: number
  }


  export type RaffleSimulationAvgAggregateInputType = {
    eventId?: true
  }

  export type RaffleSimulationSumAggregateInputType = {
    eventId?: true
  }

  export type RaffleSimulationMinAggregateInputType = {
    id?: true
    eventId?: true
    seed?: true
    startTime?: true
    endTime?: true
    createdAt?: true
  }

  export type RaffleSimulationMaxAggregateInputType = {
    id?: true
    eventId?: true
    seed?: true
    startTime?: true
    endTime?: true
    createdAt?: true
  }

  export type RaffleSimulationCountAggregateInputType = {
    id?: true
    eventId?: true
    seed?: true
    startTime?: true
    endTime?: true
    physicsState?: true
    createdAt?: true
    _all?: true
  }

  export type RaffleSimulationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RaffleSimulation to aggregate.
     */
    where?: RaffleSimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleSimulations to fetch.
     */
    orderBy?: RaffleSimulationOrderByWithRelationInput | RaffleSimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RaffleSimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleSimulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleSimulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RaffleSimulations
    **/
    _count?: true | RaffleSimulationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RaffleSimulationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RaffleSimulationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RaffleSimulationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RaffleSimulationMaxAggregateInputType
  }

  export type GetRaffleSimulationAggregateType<T extends RaffleSimulationAggregateArgs> = {
        [P in keyof T & keyof AggregateRaffleSimulation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRaffleSimulation[P]>
      : GetScalarType<T[P], AggregateRaffleSimulation[P]>
  }




  export type RaffleSimulationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleSimulationWhereInput
    orderBy?: RaffleSimulationOrderByWithAggregationInput | RaffleSimulationOrderByWithAggregationInput[]
    by: RaffleSimulationScalarFieldEnum[] | RaffleSimulationScalarFieldEnum
    having?: RaffleSimulationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RaffleSimulationCountAggregateInputType | true
    _avg?: RaffleSimulationAvgAggregateInputType
    _sum?: RaffleSimulationSumAggregateInputType
    _min?: RaffleSimulationMinAggregateInputType
    _max?: RaffleSimulationMaxAggregateInputType
  }

  export type RaffleSimulationGroupByOutputType = {
    id: string
    eventId: number
    seed: string
    startTime: Date
    endTime: Date
    physicsState: JsonValue
    createdAt: Date
    _count: RaffleSimulationCountAggregateOutputType | null
    _avg: RaffleSimulationAvgAggregateOutputType | null
    _sum: RaffleSimulationSumAggregateOutputType | null
    _min: RaffleSimulationMinAggregateOutputType | null
    _max: RaffleSimulationMaxAggregateOutputType | null
  }

  type GetRaffleSimulationGroupByPayload<T extends RaffleSimulationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RaffleSimulationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RaffleSimulationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RaffleSimulationGroupByOutputType[P]>
            : GetScalarType<T[P], RaffleSimulationGroupByOutputType[P]>
        }
      >
    >


  export type RaffleSimulationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    seed?: boolean
    startTime?: boolean
    endTime?: boolean
    physicsState?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleSimulation"]>

  export type RaffleSimulationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    seed?: boolean
    startTime?: boolean
    endTime?: boolean
    physicsState?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleSimulation"]>

  export type RaffleSimulationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    seed?: boolean
    startTime?: boolean
    endTime?: boolean
    physicsState?: boolean
    createdAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["raffleSimulation"]>

  export type RaffleSimulationSelectScalar = {
    id?: boolean
    eventId?: boolean
    seed?: boolean
    startTime?: boolean
    endTime?: boolean
    physicsState?: boolean
    createdAt?: boolean
  }

  export type RaffleSimulationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "seed" | "startTime" | "endTime" | "physicsState" | "createdAt", ExtArgs["result"]["raffleSimulation"]>
  export type RaffleSimulationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type RaffleSimulationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type RaffleSimulationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $RaffleSimulationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RaffleSimulation"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: number
      seed: string
      startTime: Date
      endTime: Date
      physicsState: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["raffleSimulation"]>
    composites: {}
  }

  type RaffleSimulationGetPayload<S extends boolean | null | undefined | RaffleSimulationDefaultArgs> = $Result.GetResult<Prisma.$RaffleSimulationPayload, S>

  type RaffleSimulationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RaffleSimulationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RaffleSimulationCountAggregateInputType | true
    }

  export interface RaffleSimulationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RaffleSimulation'], meta: { name: 'RaffleSimulation' } }
    /**
     * Find zero or one RaffleSimulation that matches the filter.
     * @param {RaffleSimulationFindUniqueArgs} args - Arguments to find a RaffleSimulation
     * @example
     * // Get one RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RaffleSimulationFindUniqueArgs>(args: SelectSubset<T, RaffleSimulationFindUniqueArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RaffleSimulation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RaffleSimulationFindUniqueOrThrowArgs} args - Arguments to find a RaffleSimulation
     * @example
     * // Get one RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RaffleSimulationFindUniqueOrThrowArgs>(args: SelectSubset<T, RaffleSimulationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RaffleSimulation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationFindFirstArgs} args - Arguments to find a RaffleSimulation
     * @example
     * // Get one RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RaffleSimulationFindFirstArgs>(args?: SelectSubset<T, RaffleSimulationFindFirstArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RaffleSimulation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationFindFirstOrThrowArgs} args - Arguments to find a RaffleSimulation
     * @example
     * // Get one RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RaffleSimulationFindFirstOrThrowArgs>(args?: SelectSubset<T, RaffleSimulationFindFirstOrThrowArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RaffleSimulations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RaffleSimulations
     * const raffleSimulations = await prisma.raffleSimulation.findMany()
     * 
     * // Get first 10 RaffleSimulations
     * const raffleSimulations = await prisma.raffleSimulation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const raffleSimulationWithIdOnly = await prisma.raffleSimulation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RaffleSimulationFindManyArgs>(args?: SelectSubset<T, RaffleSimulationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RaffleSimulation.
     * @param {RaffleSimulationCreateArgs} args - Arguments to create a RaffleSimulation.
     * @example
     * // Create one RaffleSimulation
     * const RaffleSimulation = await prisma.raffleSimulation.create({
     *   data: {
     *     // ... data to create a RaffleSimulation
     *   }
     * })
     * 
     */
    create<T extends RaffleSimulationCreateArgs>(args: SelectSubset<T, RaffleSimulationCreateArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RaffleSimulations.
     * @param {RaffleSimulationCreateManyArgs} args - Arguments to create many RaffleSimulations.
     * @example
     * // Create many RaffleSimulations
     * const raffleSimulation = await prisma.raffleSimulation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RaffleSimulationCreateManyArgs>(args?: SelectSubset<T, RaffleSimulationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RaffleSimulations and returns the data saved in the database.
     * @param {RaffleSimulationCreateManyAndReturnArgs} args - Arguments to create many RaffleSimulations.
     * @example
     * // Create many RaffleSimulations
     * const raffleSimulation = await prisma.raffleSimulation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RaffleSimulations and only return the `id`
     * const raffleSimulationWithIdOnly = await prisma.raffleSimulation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RaffleSimulationCreateManyAndReturnArgs>(args?: SelectSubset<T, RaffleSimulationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RaffleSimulation.
     * @param {RaffleSimulationDeleteArgs} args - Arguments to delete one RaffleSimulation.
     * @example
     * // Delete one RaffleSimulation
     * const RaffleSimulation = await prisma.raffleSimulation.delete({
     *   where: {
     *     // ... filter to delete one RaffleSimulation
     *   }
     * })
     * 
     */
    delete<T extends RaffleSimulationDeleteArgs>(args: SelectSubset<T, RaffleSimulationDeleteArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RaffleSimulation.
     * @param {RaffleSimulationUpdateArgs} args - Arguments to update one RaffleSimulation.
     * @example
     * // Update one RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RaffleSimulationUpdateArgs>(args: SelectSubset<T, RaffleSimulationUpdateArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RaffleSimulations.
     * @param {RaffleSimulationDeleteManyArgs} args - Arguments to filter RaffleSimulations to delete.
     * @example
     * // Delete a few RaffleSimulations
     * const { count } = await prisma.raffleSimulation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RaffleSimulationDeleteManyArgs>(args?: SelectSubset<T, RaffleSimulationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RaffleSimulations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RaffleSimulations
     * const raffleSimulation = await prisma.raffleSimulation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RaffleSimulationUpdateManyArgs>(args: SelectSubset<T, RaffleSimulationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RaffleSimulations and returns the data updated in the database.
     * @param {RaffleSimulationUpdateManyAndReturnArgs} args - Arguments to update many RaffleSimulations.
     * @example
     * // Update many RaffleSimulations
     * const raffleSimulation = await prisma.raffleSimulation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RaffleSimulations and only return the `id`
     * const raffleSimulationWithIdOnly = await prisma.raffleSimulation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RaffleSimulationUpdateManyAndReturnArgs>(args: SelectSubset<T, RaffleSimulationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RaffleSimulation.
     * @param {RaffleSimulationUpsertArgs} args - Arguments to update or create a RaffleSimulation.
     * @example
     * // Update or create a RaffleSimulation
     * const raffleSimulation = await prisma.raffleSimulation.upsert({
     *   create: {
     *     // ... data to create a RaffleSimulation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RaffleSimulation we want to update
     *   }
     * })
     */
    upsert<T extends RaffleSimulationUpsertArgs>(args: SelectSubset<T, RaffleSimulationUpsertArgs<ExtArgs>>): Prisma__RaffleSimulationClient<$Result.GetResult<Prisma.$RaffleSimulationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RaffleSimulations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationCountArgs} args - Arguments to filter RaffleSimulations to count.
     * @example
     * // Count the number of RaffleSimulations
     * const count = await prisma.raffleSimulation.count({
     *   where: {
     *     // ... the filter for the RaffleSimulations we want to count
     *   }
     * })
    **/
    count<T extends RaffleSimulationCountArgs>(
      args?: Subset<T, RaffleSimulationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RaffleSimulationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RaffleSimulation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RaffleSimulationAggregateArgs>(args: Subset<T, RaffleSimulationAggregateArgs>): Prisma.PrismaPromise<GetRaffleSimulationAggregateType<T>>

    /**
     * Group by RaffleSimulation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleSimulationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RaffleSimulationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RaffleSimulationGroupByArgs['orderBy'] }
        : { orderBy?: RaffleSimulationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RaffleSimulationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRaffleSimulationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RaffleSimulation model
   */
  readonly fields: RaffleSimulationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RaffleSimulation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RaffleSimulationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RaffleSimulation model
   */
  interface RaffleSimulationFieldRefs {
    readonly id: FieldRef<"RaffleSimulation", 'String'>
    readonly eventId: FieldRef<"RaffleSimulation", 'Int'>
    readonly seed: FieldRef<"RaffleSimulation", 'String'>
    readonly startTime: FieldRef<"RaffleSimulation", 'DateTime'>
    readonly endTime: FieldRef<"RaffleSimulation", 'DateTime'>
    readonly physicsState: FieldRef<"RaffleSimulation", 'Json'>
    readonly createdAt: FieldRef<"RaffleSimulation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RaffleSimulation findUnique
   */
  export type RaffleSimulationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter, which RaffleSimulation to fetch.
     */
    where: RaffleSimulationWhereUniqueInput
  }

  /**
   * RaffleSimulation findUniqueOrThrow
   */
  export type RaffleSimulationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter, which RaffleSimulation to fetch.
     */
    where: RaffleSimulationWhereUniqueInput
  }

  /**
   * RaffleSimulation findFirst
   */
  export type RaffleSimulationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter, which RaffleSimulation to fetch.
     */
    where?: RaffleSimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleSimulations to fetch.
     */
    orderBy?: RaffleSimulationOrderByWithRelationInput | RaffleSimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RaffleSimulations.
     */
    cursor?: RaffleSimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleSimulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleSimulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RaffleSimulations.
     */
    distinct?: RaffleSimulationScalarFieldEnum | RaffleSimulationScalarFieldEnum[]
  }

  /**
   * RaffleSimulation findFirstOrThrow
   */
  export type RaffleSimulationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter, which RaffleSimulation to fetch.
     */
    where?: RaffleSimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleSimulations to fetch.
     */
    orderBy?: RaffleSimulationOrderByWithRelationInput | RaffleSimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RaffleSimulations.
     */
    cursor?: RaffleSimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleSimulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleSimulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RaffleSimulations.
     */
    distinct?: RaffleSimulationScalarFieldEnum | RaffleSimulationScalarFieldEnum[]
  }

  /**
   * RaffleSimulation findMany
   */
  export type RaffleSimulationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter, which RaffleSimulations to fetch.
     */
    where?: RaffleSimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RaffleSimulations to fetch.
     */
    orderBy?: RaffleSimulationOrderByWithRelationInput | RaffleSimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RaffleSimulations.
     */
    cursor?: RaffleSimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RaffleSimulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RaffleSimulations.
     */
    skip?: number
    distinct?: RaffleSimulationScalarFieldEnum | RaffleSimulationScalarFieldEnum[]
  }

  /**
   * RaffleSimulation create
   */
  export type RaffleSimulationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * The data needed to create a RaffleSimulation.
     */
    data: XOR<RaffleSimulationCreateInput, RaffleSimulationUncheckedCreateInput>
  }

  /**
   * RaffleSimulation createMany
   */
  export type RaffleSimulationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RaffleSimulations.
     */
    data: RaffleSimulationCreateManyInput | RaffleSimulationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RaffleSimulation createManyAndReturn
   */
  export type RaffleSimulationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * The data used to create many RaffleSimulations.
     */
    data: RaffleSimulationCreateManyInput | RaffleSimulationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RaffleSimulation update
   */
  export type RaffleSimulationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * The data needed to update a RaffleSimulation.
     */
    data: XOR<RaffleSimulationUpdateInput, RaffleSimulationUncheckedUpdateInput>
    /**
     * Choose, which RaffleSimulation to update.
     */
    where: RaffleSimulationWhereUniqueInput
  }

  /**
   * RaffleSimulation updateMany
   */
  export type RaffleSimulationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RaffleSimulations.
     */
    data: XOR<RaffleSimulationUpdateManyMutationInput, RaffleSimulationUncheckedUpdateManyInput>
    /**
     * Filter which RaffleSimulations to update
     */
    where?: RaffleSimulationWhereInput
    /**
     * Limit how many RaffleSimulations to update.
     */
    limit?: number
  }

  /**
   * RaffleSimulation updateManyAndReturn
   */
  export type RaffleSimulationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * The data used to update RaffleSimulations.
     */
    data: XOR<RaffleSimulationUpdateManyMutationInput, RaffleSimulationUncheckedUpdateManyInput>
    /**
     * Filter which RaffleSimulations to update
     */
    where?: RaffleSimulationWhereInput
    /**
     * Limit how many RaffleSimulations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RaffleSimulation upsert
   */
  export type RaffleSimulationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * The filter to search for the RaffleSimulation to update in case it exists.
     */
    where: RaffleSimulationWhereUniqueInput
    /**
     * In case the RaffleSimulation found by the `where` argument doesn't exist, create a new RaffleSimulation with this data.
     */
    create: XOR<RaffleSimulationCreateInput, RaffleSimulationUncheckedCreateInput>
    /**
     * In case the RaffleSimulation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RaffleSimulationUpdateInput, RaffleSimulationUncheckedUpdateInput>
  }

  /**
   * RaffleSimulation delete
   */
  export type RaffleSimulationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
    /**
     * Filter which RaffleSimulation to delete.
     */
    where: RaffleSimulationWhereUniqueInput
  }

  /**
   * RaffleSimulation deleteMany
   */
  export type RaffleSimulationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RaffleSimulations to delete
     */
    where?: RaffleSimulationWhereInput
    /**
     * Limit how many RaffleSimulations to delete.
     */
    limit?: number
  }

  /**
   * RaffleSimulation without action
   */
  export type RaffleSimulationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RaffleSimulation
     */
    select?: RaffleSimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RaffleSimulation
     */
    omit?: RaffleSimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RaffleSimulationInclude<ExtArgs> | null
  }


  /**
   * Model Quota
   */

  export type AggregateQuota = {
    _count: QuotaCountAggregateOutputType | null
    _avg: QuotaAvgAggregateOutputType | null
    _sum: QuotaSumAggregateOutputType | null
    _min: QuotaMinAggregateOutputType | null
    _max: QuotaMaxAggregateOutputType | null
  }

  export type QuotaAvgAggregateOutputType = {
    size: number | null
    sortId: number | null
    eventId: number | null
  }

  export type QuotaSumAggregateOutputType = {
    size: number | null
    sortId: number | null
    eventId: number | null
  }

  export type QuotaMinAggregateOutputType = {
    id: string | null
    title: string | null
    size: number | null
    sortId: number | null
    eventId: number | null
  }

  export type QuotaMaxAggregateOutputType = {
    id: string | null
    title: string | null
    size: number | null
    sortId: number | null
    eventId: number | null
  }

  export type QuotaCountAggregateOutputType = {
    id: number
    title: number
    size: number
    sortId: number
    eventId: number
    _all: number
  }


  export type QuotaAvgAggregateInputType = {
    size?: true
    sortId?: true
    eventId?: true
  }

  export type QuotaSumAggregateInputType = {
    size?: true
    sortId?: true
    eventId?: true
  }

  export type QuotaMinAggregateInputType = {
    id?: true
    title?: true
    size?: true
    sortId?: true
    eventId?: true
  }

  export type QuotaMaxAggregateInputType = {
    id?: true
    title?: true
    size?: true
    sortId?: true
    eventId?: true
  }

  export type QuotaCountAggregateInputType = {
    id?: true
    title?: true
    size?: true
    sortId?: true
    eventId?: true
    _all?: true
  }

  export type QuotaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quota to aggregate.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quotas
    **/
    _count?: true | QuotaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotaMaxAggregateInputType
  }

  export type GetQuotaAggregateType<T extends QuotaAggregateArgs> = {
        [P in keyof T & keyof AggregateQuota]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuota[P]>
      : GetScalarType<T[P], AggregateQuota[P]>
  }




  export type QuotaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotaWhereInput
    orderBy?: QuotaOrderByWithAggregationInput | QuotaOrderByWithAggregationInput[]
    by: QuotaScalarFieldEnum[] | QuotaScalarFieldEnum
    having?: QuotaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotaCountAggregateInputType | true
    _avg?: QuotaAvgAggregateInputType
    _sum?: QuotaSumAggregateInputType
    _min?: QuotaMinAggregateInputType
    _max?: QuotaMaxAggregateInputType
  }

  export type QuotaGroupByOutputType = {
    id: string
    title: string
    size: number | null
    sortId: number
    eventId: number
    _count: QuotaCountAggregateOutputType | null
    _avg: QuotaAvgAggregateOutputType | null
    _sum: QuotaSumAggregateOutputType | null
    _min: QuotaMinAggregateOutputType | null
    _max: QuotaMaxAggregateOutputType | null
  }

  type GetQuotaGroupByPayload<T extends QuotaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotaGroupByOutputType[P]>
            : GetScalarType<T[P], QuotaGroupByOutputType[P]>
        }
      >
    >


  export type QuotaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    size?: boolean
    sortId?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
    Signups?: boolean | Quota$SignupsArgs<ExtArgs>
    OriginalSignups?: boolean | Quota$OriginalSignupsArgs<ExtArgs>
    _count?: boolean | QuotaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quota"]>

  export type QuotaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    size?: boolean
    sortId?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quota"]>

  export type QuotaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    size?: boolean
    sortId?: boolean
    eventId?: boolean
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quota"]>

  export type QuotaSelectScalar = {
    id?: boolean
    title?: boolean
    size?: boolean
    sortId?: boolean
    eventId?: boolean
  }

  export type QuotaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "size" | "sortId" | "eventId", ExtArgs["result"]["quota"]>
  export type QuotaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
    Signups?: boolean | Quota$SignupsArgs<ExtArgs>
    OriginalSignups?: boolean | Quota$OriginalSignupsArgs<ExtArgs>
    _count?: boolean | QuotaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuotaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }
  export type QuotaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Event?: boolean | EventDefaultArgs<ExtArgs>
  }

  export type $QuotaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quota"
    objects: {
      Event: Prisma.$EventPayload<ExtArgs>
      Signups: Prisma.$SignupPayload<ExtArgs>[]
      OriginalSignups: Prisma.$SignupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      size: number | null
      sortId: number
      eventId: number
    }, ExtArgs["result"]["quota"]>
    composites: {}
  }

  type QuotaGetPayload<S extends boolean | null | undefined | QuotaDefaultArgs> = $Result.GetResult<Prisma.$QuotaPayload, S>

  type QuotaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuotaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuotaCountAggregateInputType | true
    }

  export interface QuotaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quota'], meta: { name: 'Quota' } }
    /**
     * Find zero or one Quota that matches the filter.
     * @param {QuotaFindUniqueArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotaFindUniqueArgs>(args: SelectSubset<T, QuotaFindUniqueArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Quota that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuotaFindUniqueOrThrowArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotaFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quota that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindFirstArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotaFindFirstArgs>(args?: SelectSubset<T, QuotaFindFirstArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quota that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindFirstOrThrowArgs} args - Arguments to find a Quota
     * @example
     * // Get one Quota
     * const quota = await prisma.quota.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotaFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotaFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Quotas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quotas
     * const quotas = await prisma.quota.findMany()
     * 
     * // Get first 10 Quotas
     * const quotas = await prisma.quota.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotaWithIdOnly = await prisma.quota.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotaFindManyArgs>(args?: SelectSubset<T, QuotaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Quota.
     * @param {QuotaCreateArgs} args - Arguments to create a Quota.
     * @example
     * // Create one Quota
     * const Quota = await prisma.quota.create({
     *   data: {
     *     // ... data to create a Quota
     *   }
     * })
     * 
     */
    create<T extends QuotaCreateArgs>(args: SelectSubset<T, QuotaCreateArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Quotas.
     * @param {QuotaCreateManyArgs} args - Arguments to create many Quotas.
     * @example
     * // Create many Quotas
     * const quota = await prisma.quota.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotaCreateManyArgs>(args?: SelectSubset<T, QuotaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quotas and returns the data saved in the database.
     * @param {QuotaCreateManyAndReturnArgs} args - Arguments to create many Quotas.
     * @example
     * // Create many Quotas
     * const quota = await prisma.quota.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quotas and only return the `id`
     * const quotaWithIdOnly = await prisma.quota.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuotaCreateManyAndReturnArgs>(args?: SelectSubset<T, QuotaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Quota.
     * @param {QuotaDeleteArgs} args - Arguments to delete one Quota.
     * @example
     * // Delete one Quota
     * const Quota = await prisma.quota.delete({
     *   where: {
     *     // ... filter to delete one Quota
     *   }
     * })
     * 
     */
    delete<T extends QuotaDeleteArgs>(args: SelectSubset<T, QuotaDeleteArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Quota.
     * @param {QuotaUpdateArgs} args - Arguments to update one Quota.
     * @example
     * // Update one Quota
     * const quota = await prisma.quota.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotaUpdateArgs>(args: SelectSubset<T, QuotaUpdateArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Quotas.
     * @param {QuotaDeleteManyArgs} args - Arguments to filter Quotas to delete.
     * @example
     * // Delete a few Quotas
     * const { count } = await prisma.quota.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotaDeleteManyArgs>(args?: SelectSubset<T, QuotaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quotas
     * const quota = await prisma.quota.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotaUpdateManyArgs>(args: SelectSubset<T, QuotaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotas and returns the data updated in the database.
     * @param {QuotaUpdateManyAndReturnArgs} args - Arguments to update many Quotas.
     * @example
     * // Update many Quotas
     * const quota = await prisma.quota.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Quotas and only return the `id`
     * const quotaWithIdOnly = await prisma.quota.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuotaUpdateManyAndReturnArgs>(args: SelectSubset<T, QuotaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Quota.
     * @param {QuotaUpsertArgs} args - Arguments to update or create a Quota.
     * @example
     * // Update or create a Quota
     * const quota = await prisma.quota.upsert({
     *   create: {
     *     // ... data to create a Quota
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quota we want to update
     *   }
     * })
     */
    upsert<T extends QuotaUpsertArgs>(args: SelectSubset<T, QuotaUpsertArgs<ExtArgs>>): Prisma__QuotaClient<$Result.GetResult<Prisma.$QuotaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Quotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaCountArgs} args - Arguments to filter Quotas to count.
     * @example
     * // Count the number of Quotas
     * const count = await prisma.quota.count({
     *   where: {
     *     // ... the filter for the Quotas we want to count
     *   }
     * })
    **/
    count<T extends QuotaCountArgs>(
      args?: Subset<T, QuotaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotaAggregateArgs>(args: Subset<T, QuotaAggregateArgs>): Prisma.PrismaPromise<GetQuotaAggregateType<T>>

    /**
     * Group by Quota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotaGroupByArgs['orderBy'] }
        : { orderBy?: QuotaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quota model
   */
  readonly fields: QuotaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quota.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Signups<T extends Quota$SignupsArgs<ExtArgs> = {}>(args?: Subset<T, Quota$SignupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    OriginalSignups<T extends Quota$OriginalSignupsArgs<ExtArgs> = {}>(args?: Subset<T, Quota$OriginalSignupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quota model
   */
  interface QuotaFieldRefs {
    readonly id: FieldRef<"Quota", 'String'>
    readonly title: FieldRef<"Quota", 'String'>
    readonly size: FieldRef<"Quota", 'Int'>
    readonly sortId: FieldRef<"Quota", 'Int'>
    readonly eventId: FieldRef<"Quota", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Quota findUnique
   */
  export type QuotaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota findUniqueOrThrow
   */
  export type QuotaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota findFirst
   */
  export type QuotaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotas.
     */
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota findFirstOrThrow
   */
  export type QuotaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quota to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotas.
     */
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota findMany
   */
  export type QuotaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter, which Quotas to fetch.
     */
    where?: QuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotas to fetch.
     */
    orderBy?: QuotaOrderByWithRelationInput | QuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quotas.
     */
    cursor?: QuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotas.
     */
    skip?: number
    distinct?: QuotaScalarFieldEnum | QuotaScalarFieldEnum[]
  }

  /**
   * Quota create
   */
  export type QuotaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The data needed to create a Quota.
     */
    data: XOR<QuotaCreateInput, QuotaUncheckedCreateInput>
  }

  /**
   * Quota createMany
   */
  export type QuotaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quotas.
     */
    data: QuotaCreateManyInput | QuotaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quota createManyAndReturn
   */
  export type QuotaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * The data used to create many Quotas.
     */
    data: QuotaCreateManyInput | QuotaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quota update
   */
  export type QuotaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The data needed to update a Quota.
     */
    data: XOR<QuotaUpdateInput, QuotaUncheckedUpdateInput>
    /**
     * Choose, which Quota to update.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota updateMany
   */
  export type QuotaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quotas.
     */
    data: XOR<QuotaUpdateManyMutationInput, QuotaUncheckedUpdateManyInput>
    /**
     * Filter which Quotas to update
     */
    where?: QuotaWhereInput
    /**
     * Limit how many Quotas to update.
     */
    limit?: number
  }

  /**
   * Quota updateManyAndReturn
   */
  export type QuotaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * The data used to update Quotas.
     */
    data: XOR<QuotaUpdateManyMutationInput, QuotaUncheckedUpdateManyInput>
    /**
     * Filter which Quotas to update
     */
    where?: QuotaWhereInput
    /**
     * Limit how many Quotas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quota upsert
   */
  export type QuotaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * The filter to search for the Quota to update in case it exists.
     */
    where: QuotaWhereUniqueInput
    /**
     * In case the Quota found by the `where` argument doesn't exist, create a new Quota with this data.
     */
    create: XOR<QuotaCreateInput, QuotaUncheckedCreateInput>
    /**
     * In case the Quota was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotaUpdateInput, QuotaUncheckedUpdateInput>
  }

  /**
   * Quota delete
   */
  export type QuotaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
    /**
     * Filter which Quota to delete.
     */
    where: QuotaWhereUniqueInput
  }

  /**
   * Quota deleteMany
   */
  export type QuotaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotas to delete
     */
    where?: QuotaWhereInput
    /**
     * Limit how many Quotas to delete.
     */
    limit?: number
  }

  /**
   * Quota.Signups
   */
  export type Quota$SignupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    where?: SignupWhereInput
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    cursor?: SignupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SignupScalarFieldEnum | SignupScalarFieldEnum[]
  }

  /**
   * Quota.OriginalSignups
   */
  export type Quota$OriginalSignupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Signup
     */
    select?: SignupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Signup
     */
    omit?: SignupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SignupInclude<ExtArgs> | null
    where?: SignupWhereInput
    orderBy?: SignupOrderByWithRelationInput | SignupOrderByWithRelationInput[]
    cursor?: SignupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SignupScalarFieldEnum | SignupScalarFieldEnum[]
  }

  /**
   * Quota without action
   */
  export type QuotaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quota
     */
    select?: QuotaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quota
     */
    omit?: QuotaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotaInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ExampleScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExampleScalarFieldEnum = (typeof ExampleScalarFieldEnum)[keyof typeof ExampleScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const EmailVerificationTokenScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    email: 'email'
  };

  export type EmailVerificationTokenScalarFieldEnum = (typeof EmailVerificationTokenScalarFieldEnum)[keyof typeof EmailVerificationTokenScalarFieldEnum]


  export const PasswordChangeTokenScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    email: 'email'
  };

  export type PasswordChangeTokenScalarFieldEnum = (typeof PasswordChangeTokenScalarFieldEnum)[keyof typeof PasswordChangeTokenScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    title: 'title',
    date: 'date',
    registrationStartDate: 'registrationStartDate',
    registrationEndDate: 'registrationEndDate',
    openQuotaSize: 'openQuotaSize',
    description: 'description',
    price: 'price',
    location: 'location',
    webpageUrl: 'webpageUrl',
    draft: 'draft',
    signupsPublic: 'signupsPublic',
    verificationEmail: 'verificationEmail',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    raffleEnabled: 'raffleEnabled',
    raffleStartTime: 'raffleStartTime',
    raffleEndTime: 'raffleEndTime',
    raffleStatus: 'raffleStatus'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    question: 'question',
    type: 'type',
    sortId: 'sortId',
    options: 'options',
    required: 'required',
    public: 'public',
    eventId: 'eventId'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const AnswerScalarFieldEnum: {
    id: 'id',
    answer: 'answer',
    questionId: 'questionId',
    signupId: 'signupId'
  };

  export type AnswerScalarFieldEnum = (typeof AnswerScalarFieldEnum)[keyof typeof AnswerScalarFieldEnum]


  export const SignupScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    quotaId: 'quotaId',
    originalQuotaId: 'originalQuotaId',
    registrationIntent: 'registrationIntent',
    status: 'status'
  };

  export type SignupScalarFieldEnum = (typeof SignupScalarFieldEnum)[keyof typeof SignupScalarFieldEnum]


  export const RaffleSimulationScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    seed: 'seed',
    startTime: 'startTime',
    endTime: 'endTime',
    physicsState: 'physicsState',
    createdAt: 'createdAt'
  };

  export type RaffleSimulationScalarFieldEnum = (typeof RaffleSimulationScalarFieldEnum)[keyof typeof RaffleSimulationScalarFieldEnum]


  export const QuotaScalarFieldEnum: {
    id: 'id',
    title: 'title',
    size: 'size',
    sortId: 'sortId',
    eventId: 'eventId'
  };

  export type QuotaScalarFieldEnum = (typeof QuotaScalarFieldEnum)[keyof typeof QuotaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'RaffleStatus'
   */
  export type EnumRaffleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RaffleStatus'>
    


  /**
   * Reference to a field of type 'RaffleStatus[]'
   */
  export type ListEnumRaffleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RaffleStatus[]'>
    


  /**
   * Reference to a field of type 'QuestionType'
   */
  export type EnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType'>
    


  /**
   * Reference to a field of type 'QuestionType[]'
   */
  export type ListEnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType[]'>
    


  /**
   * Reference to a field of type 'SignupStatus'
   */
  export type EnumSignupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SignupStatus'>
    


  /**
   * Reference to a field of type 'SignupStatus[]'
   */
  export type ListEnumSignupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SignupStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ExampleWhereInput = {
    AND?: ExampleWhereInput | ExampleWhereInput[]
    OR?: ExampleWhereInput[]
    NOT?: ExampleWhereInput | ExampleWhereInput[]
    id?: StringFilter<"Example"> | string
    createdAt?: DateTimeFilter<"Example"> | Date | string
    updatedAt?: DateTimeFilter<"Example"> | Date | string
  }

  export type ExampleOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExampleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExampleWhereInput | ExampleWhereInput[]
    OR?: ExampleWhereInput[]
    NOT?: ExampleWhereInput | ExampleWhereInput[]
    createdAt?: DateTimeFilter<"Example"> | Date | string
    updatedAt?: DateTimeFilter<"Example"> | Date | string
  }, "id">

  export type ExampleOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExampleCountOrderByAggregateInput
    _max?: ExampleMaxOrderByAggregateInput
    _min?: ExampleMinOrderByAggregateInput
  }

  export type ExampleScalarWhereWithAggregatesInput = {
    AND?: ExampleScalarWhereWithAggregatesInput | ExampleScalarWhereWithAggregatesInput[]
    OR?: ExampleScalarWhereWithAggregatesInput[]
    NOT?: ExampleScalarWhereWithAggregatesInput | ExampleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Example"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Example"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Example"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type EmailVerificationTokenWhereInput = {
    AND?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    OR?: EmailVerificationTokenWhereInput[]
    NOT?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    id?: StringFilter<"EmailVerificationToken"> | string
    createdAt?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    expiresAt?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    email?: StringFilter<"EmailVerificationToken"> | string
  }

  export type EmailVerificationTokenOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type EmailVerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    OR?: EmailVerificationTokenWhereInput[]
    NOT?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    createdAt?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    expiresAt?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    email?: StringFilter<"EmailVerificationToken"> | string
  }, "id">

  export type EmailVerificationTokenOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
    _count?: EmailVerificationTokenCountOrderByAggregateInput
    _max?: EmailVerificationTokenMaxOrderByAggregateInput
    _min?: EmailVerificationTokenMinOrderByAggregateInput
  }

  export type EmailVerificationTokenScalarWhereWithAggregatesInput = {
    AND?: EmailVerificationTokenScalarWhereWithAggregatesInput | EmailVerificationTokenScalarWhereWithAggregatesInput[]
    OR?: EmailVerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: EmailVerificationTokenScalarWhereWithAggregatesInput | EmailVerificationTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailVerificationToken"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EmailVerificationToken"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"EmailVerificationToken"> | Date | string
    email?: StringWithAggregatesFilter<"EmailVerificationToken"> | string
  }

  export type PasswordChangeTokenWhereInput = {
    AND?: PasswordChangeTokenWhereInput | PasswordChangeTokenWhereInput[]
    OR?: PasswordChangeTokenWhereInput[]
    NOT?: PasswordChangeTokenWhereInput | PasswordChangeTokenWhereInput[]
    id?: StringFilter<"PasswordChangeToken"> | string
    createdAt?: DateTimeFilter<"PasswordChangeToken"> | Date | string
    expiresAt?: DateTimeFilter<"PasswordChangeToken"> | Date | string
    email?: StringFilter<"PasswordChangeToken"> | string
  }

  export type PasswordChangeTokenOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type PasswordChangeTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PasswordChangeTokenWhereInput | PasswordChangeTokenWhereInput[]
    OR?: PasswordChangeTokenWhereInput[]
    NOT?: PasswordChangeTokenWhereInput | PasswordChangeTokenWhereInput[]
    createdAt?: DateTimeFilter<"PasswordChangeToken"> | Date | string
    expiresAt?: DateTimeFilter<"PasswordChangeToken"> | Date | string
    email?: StringFilter<"PasswordChangeToken"> | string
  }, "id">

  export type PasswordChangeTokenOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
    _count?: PasswordChangeTokenCountOrderByAggregateInput
    _max?: PasswordChangeTokenMaxOrderByAggregateInput
    _min?: PasswordChangeTokenMinOrderByAggregateInput
  }

  export type PasswordChangeTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordChangeTokenScalarWhereWithAggregatesInput | PasswordChangeTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordChangeTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordChangeTokenScalarWhereWithAggregatesInput | PasswordChangeTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordChangeToken"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordChangeToken"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordChangeToken"> | Date | string
    email?: StringWithAggregatesFilter<"PasswordChangeToken"> | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: IntFilter<"Event"> | number
    title?: StringFilter<"Event"> | string
    date?: DateTimeFilter<"Event"> | Date | string
    registrationStartDate?: DateTimeFilter<"Event"> | Date | string
    registrationEndDate?: DateTimeFilter<"Event"> | Date | string
    openQuotaSize?: IntFilter<"Event"> | number
    description?: StringNullableFilter<"Event"> | string | null
    price?: StringNullableFilter<"Event"> | string | null
    location?: StringNullableFilter<"Event"> | string | null
    webpageUrl?: StringNullableFilter<"Event"> | string | null
    draft?: BoolFilter<"Event"> | boolean
    signupsPublic?: BoolFilter<"Event"> | boolean
    verificationEmail?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleEnabled?: BoolFilter<"Event"> | boolean
    raffleStartTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleEndTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleStatus?: EnumRaffleStatusFilter<"Event"> | $Enums.RaffleStatus
    Questions?: QuestionListRelationFilter
    Quotas?: QuotaListRelationFilter
    raffleSimulations?: RaffleSimulationListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    openQuotaSize?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    webpageUrl?: SortOrderInput | SortOrder
    draft?: SortOrder
    signupsPublic?: SortOrder
    verificationEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    raffleEnabled?: SortOrder
    raffleStartTime?: SortOrderInput | SortOrder
    raffleEndTime?: SortOrderInput | SortOrder
    raffleStatus?: SortOrder
    Questions?: QuestionOrderByRelationAggregateInput
    Quotas?: QuotaOrderByRelationAggregateInput
    raffleSimulations?: RaffleSimulationOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    title?: StringFilter<"Event"> | string
    date?: DateTimeFilter<"Event"> | Date | string
    registrationStartDate?: DateTimeFilter<"Event"> | Date | string
    registrationEndDate?: DateTimeFilter<"Event"> | Date | string
    openQuotaSize?: IntFilter<"Event"> | number
    description?: StringNullableFilter<"Event"> | string | null
    price?: StringNullableFilter<"Event"> | string | null
    location?: StringNullableFilter<"Event"> | string | null
    webpageUrl?: StringNullableFilter<"Event"> | string | null
    draft?: BoolFilter<"Event"> | boolean
    signupsPublic?: BoolFilter<"Event"> | boolean
    verificationEmail?: StringNullableFilter<"Event"> | string | null
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleEnabled?: BoolFilter<"Event"> | boolean
    raffleStartTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleEndTime?: DateTimeNullableFilter<"Event"> | Date | string | null
    raffleStatus?: EnumRaffleStatusFilter<"Event"> | $Enums.RaffleStatus
    Questions?: QuestionListRelationFilter
    Quotas?: QuotaListRelationFilter
    raffleSimulations?: RaffleSimulationListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    openQuotaSize?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    webpageUrl?: SortOrderInput | SortOrder
    draft?: SortOrder
    signupsPublic?: SortOrder
    verificationEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    raffleEnabled?: SortOrder
    raffleStartTime?: SortOrderInput | SortOrder
    raffleEndTime?: SortOrderInput | SortOrder
    raffleStatus?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Event"> | number
    title?: StringWithAggregatesFilter<"Event"> | string
    date?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    registrationStartDate?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    registrationEndDate?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    openQuotaSize?: IntWithAggregatesFilter<"Event"> | number
    description?: StringNullableWithAggregatesFilter<"Event"> | string | null
    price?: StringNullableWithAggregatesFilter<"Event"> | string | null
    location?: StringNullableWithAggregatesFilter<"Event"> | string | null
    webpageUrl?: StringNullableWithAggregatesFilter<"Event"> | string | null
    draft?: BoolWithAggregatesFilter<"Event"> | boolean
    signupsPublic?: BoolWithAggregatesFilter<"Event"> | boolean
    verificationEmail?: StringNullableWithAggregatesFilter<"Event"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    raffleEnabled?: BoolWithAggregatesFilter<"Event"> | boolean
    raffleStartTime?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    raffleEndTime?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    raffleStatus?: EnumRaffleStatusWithAggregatesFilter<"Event"> | $Enums.RaffleStatus
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: StringFilter<"Question"> | string
    question?: StringFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    sortId?: IntFilter<"Question"> | number
    options?: StringNullableListFilter<"Question">
    required?: BoolFilter<"Question"> | boolean
    public?: BoolFilter<"Question"> | boolean
    eventId?: IntFilter<"Question"> | number
    Event?: XOR<EventScalarRelationFilter, EventWhereInput>
    Answers?: AnswerListRelationFilter
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    type?: SortOrder
    sortId?: SortOrder
    options?: SortOrder
    required?: SortOrder
    public?: SortOrder
    eventId?: SortOrder
    Event?: EventOrderByWithRelationInput
    Answers?: AnswerOrderByRelationAggregateInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    question?: StringFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    sortId?: IntFilter<"Question"> | number
    options?: StringNullableListFilter<"Question">
    required?: BoolFilter<"Question"> | boolean
    public?: BoolFilter<"Question"> | boolean
    eventId?: IntFilter<"Question"> | number
    Event?: XOR<EventScalarRelationFilter, EventWhereInput>
    Answers?: AnswerListRelationFilter
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    type?: SortOrder
    sortId?: SortOrder
    options?: SortOrder
    required?: SortOrder
    public?: SortOrder
    eventId?: SortOrder
    _count?: QuestionCountOrderByAggregateInput
    _avg?: QuestionAvgOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
    _sum?: QuestionSumOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Question"> | string
    question?: StringWithAggregatesFilter<"Question"> | string
    type?: EnumQuestionTypeWithAggregatesFilter<"Question"> | $Enums.QuestionType
    sortId?: IntWithAggregatesFilter<"Question"> | number
    options?: StringNullableListFilter<"Question">
    required?: BoolWithAggregatesFilter<"Question"> | boolean
    public?: BoolWithAggregatesFilter<"Question"> | boolean
    eventId?: IntWithAggregatesFilter<"Question"> | number
  }

  export type AnswerWhereInput = {
    AND?: AnswerWhereInput | AnswerWhereInput[]
    OR?: AnswerWhereInput[]
    NOT?: AnswerWhereInput | AnswerWhereInput[]
    id?: StringFilter<"Answer"> | string
    answer?: StringFilter<"Answer"> | string
    questionId?: StringFilter<"Answer"> | string
    signupId?: StringFilter<"Answer"> | string
    Question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
    Signup?: XOR<SignupScalarRelationFilter, SignupWhereInput>
  }

  export type AnswerOrderByWithRelationInput = {
    id?: SortOrder
    answer?: SortOrder
    questionId?: SortOrder
    signupId?: SortOrder
    Question?: QuestionOrderByWithRelationInput
    Signup?: SignupOrderByWithRelationInput
  }

  export type AnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    signup_and_question?: AnswerSignup_and_questionCompoundUniqueInput
    AND?: AnswerWhereInput | AnswerWhereInput[]
    OR?: AnswerWhereInput[]
    NOT?: AnswerWhereInput | AnswerWhereInput[]
    answer?: StringFilter<"Answer"> | string
    questionId?: StringFilter<"Answer"> | string
    signupId?: StringFilter<"Answer"> | string
    Question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
    Signup?: XOR<SignupScalarRelationFilter, SignupWhereInput>
  }, "id" | "signup_and_question">

  export type AnswerOrderByWithAggregationInput = {
    id?: SortOrder
    answer?: SortOrder
    questionId?: SortOrder
    signupId?: SortOrder
    _count?: AnswerCountOrderByAggregateInput
    _max?: AnswerMaxOrderByAggregateInput
    _min?: AnswerMinOrderByAggregateInput
  }

  export type AnswerScalarWhereWithAggregatesInput = {
    AND?: AnswerScalarWhereWithAggregatesInput | AnswerScalarWhereWithAggregatesInput[]
    OR?: AnswerScalarWhereWithAggregatesInput[]
    NOT?: AnswerScalarWhereWithAggregatesInput | AnswerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Answer"> | string
    answer?: StringWithAggregatesFilter<"Answer"> | string
    questionId?: StringWithAggregatesFilter<"Answer"> | string
    signupId?: StringWithAggregatesFilter<"Answer"> | string
  }

  export type SignupWhereInput = {
    AND?: SignupWhereInput | SignupWhereInput[]
    OR?: SignupWhereInput[]
    NOT?: SignupWhereInput | SignupWhereInput[]
    id?: StringFilter<"Signup"> | string
    name?: StringFilter<"Signup"> | string
    email?: StringFilter<"Signup"> | string
    completedAt?: DateTimeNullableFilter<"Signup"> | Date | string | null
    createdAt?: DateTimeFilter<"Signup"> | Date | string
    quotaId?: StringFilter<"Signup"> | string
    originalQuotaId?: StringFilter<"Signup"> | string
    registrationIntent?: DateTimeNullableFilter<"Signup"> | Date | string | null
    status?: EnumSignupStatusFilter<"Signup"> | $Enums.SignupStatus
    Quota?: XOR<QuotaScalarRelationFilter, QuotaWhereInput>
    OriginalQuota?: XOR<QuotaScalarRelationFilter, QuotaWhereInput>
    Answers?: AnswerListRelationFilter
  }

  export type SignupOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    quotaId?: SortOrder
    originalQuotaId?: SortOrder
    registrationIntent?: SortOrderInput | SortOrder
    status?: SortOrder
    Quota?: QuotaOrderByWithRelationInput
    OriginalQuota?: QuotaOrderByWithRelationInput
    Answers?: AnswerOrderByRelationAggregateInput
  }

  export type SignupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SignupWhereInput | SignupWhereInput[]
    OR?: SignupWhereInput[]
    NOT?: SignupWhereInput | SignupWhereInput[]
    name?: StringFilter<"Signup"> | string
    email?: StringFilter<"Signup"> | string
    completedAt?: DateTimeNullableFilter<"Signup"> | Date | string | null
    createdAt?: DateTimeFilter<"Signup"> | Date | string
    quotaId?: StringFilter<"Signup"> | string
    originalQuotaId?: StringFilter<"Signup"> | string
    registrationIntent?: DateTimeNullableFilter<"Signup"> | Date | string | null
    status?: EnumSignupStatusFilter<"Signup"> | $Enums.SignupStatus
    Quota?: XOR<QuotaScalarRelationFilter, QuotaWhereInput>
    OriginalQuota?: XOR<QuotaScalarRelationFilter, QuotaWhereInput>
    Answers?: AnswerListRelationFilter
  }, "id">

  export type SignupOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    quotaId?: SortOrder
    originalQuotaId?: SortOrder
    registrationIntent?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: SignupCountOrderByAggregateInput
    _max?: SignupMaxOrderByAggregateInput
    _min?: SignupMinOrderByAggregateInput
  }

  export type SignupScalarWhereWithAggregatesInput = {
    AND?: SignupScalarWhereWithAggregatesInput | SignupScalarWhereWithAggregatesInput[]
    OR?: SignupScalarWhereWithAggregatesInput[]
    NOT?: SignupScalarWhereWithAggregatesInput | SignupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Signup"> | string
    name?: StringWithAggregatesFilter<"Signup"> | string
    email?: StringWithAggregatesFilter<"Signup"> | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Signup"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Signup"> | Date | string
    quotaId?: StringWithAggregatesFilter<"Signup"> | string
    originalQuotaId?: StringWithAggregatesFilter<"Signup"> | string
    registrationIntent?: DateTimeNullableWithAggregatesFilter<"Signup"> | Date | string | null
    status?: EnumSignupStatusWithAggregatesFilter<"Signup"> | $Enums.SignupStatus
  }

  export type RaffleSimulationWhereInput = {
    AND?: RaffleSimulationWhereInput | RaffleSimulationWhereInput[]
    OR?: RaffleSimulationWhereInput[]
    NOT?: RaffleSimulationWhereInput | RaffleSimulationWhereInput[]
    id?: StringFilter<"RaffleSimulation"> | string
    eventId?: IntFilter<"RaffleSimulation"> | number
    seed?: StringFilter<"RaffleSimulation"> | string
    startTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    endTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    physicsState?: JsonFilter<"RaffleSimulation">
    createdAt?: DateTimeFilter<"RaffleSimulation"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }

  export type RaffleSimulationOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    seed?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    physicsState?: SortOrder
    createdAt?: SortOrder
    event?: EventOrderByWithRelationInput
  }

  export type RaffleSimulationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RaffleSimulationWhereInput | RaffleSimulationWhereInput[]
    OR?: RaffleSimulationWhereInput[]
    NOT?: RaffleSimulationWhereInput | RaffleSimulationWhereInput[]
    eventId?: IntFilter<"RaffleSimulation"> | number
    seed?: StringFilter<"RaffleSimulation"> | string
    startTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    endTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    physicsState?: JsonFilter<"RaffleSimulation">
    createdAt?: DateTimeFilter<"RaffleSimulation"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
  }, "id">

  export type RaffleSimulationOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    seed?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    physicsState?: SortOrder
    createdAt?: SortOrder
    _count?: RaffleSimulationCountOrderByAggregateInput
    _avg?: RaffleSimulationAvgOrderByAggregateInput
    _max?: RaffleSimulationMaxOrderByAggregateInput
    _min?: RaffleSimulationMinOrderByAggregateInput
    _sum?: RaffleSimulationSumOrderByAggregateInput
  }

  export type RaffleSimulationScalarWhereWithAggregatesInput = {
    AND?: RaffleSimulationScalarWhereWithAggregatesInput | RaffleSimulationScalarWhereWithAggregatesInput[]
    OR?: RaffleSimulationScalarWhereWithAggregatesInput[]
    NOT?: RaffleSimulationScalarWhereWithAggregatesInput | RaffleSimulationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RaffleSimulation"> | string
    eventId?: IntWithAggregatesFilter<"RaffleSimulation"> | number
    seed?: StringWithAggregatesFilter<"RaffleSimulation"> | string
    startTime?: DateTimeWithAggregatesFilter<"RaffleSimulation"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"RaffleSimulation"> | Date | string
    physicsState?: JsonWithAggregatesFilter<"RaffleSimulation">
    createdAt?: DateTimeWithAggregatesFilter<"RaffleSimulation"> | Date | string
  }

  export type QuotaWhereInput = {
    AND?: QuotaWhereInput | QuotaWhereInput[]
    OR?: QuotaWhereInput[]
    NOT?: QuotaWhereInput | QuotaWhereInput[]
    id?: StringFilter<"Quota"> | string
    title?: StringFilter<"Quota"> | string
    size?: IntNullableFilter<"Quota"> | number | null
    sortId?: IntFilter<"Quota"> | number
    eventId?: IntFilter<"Quota"> | number
    Event?: XOR<EventScalarRelationFilter, EventWhereInput>
    Signups?: SignupListRelationFilter
    OriginalSignups?: SignupListRelationFilter
  }

  export type QuotaOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    size?: SortOrderInput | SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
    Event?: EventOrderByWithRelationInput
    Signups?: SignupOrderByRelationAggregateInput
    OriginalSignups?: SignupOrderByRelationAggregateInput
  }

  export type QuotaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuotaWhereInput | QuotaWhereInput[]
    OR?: QuotaWhereInput[]
    NOT?: QuotaWhereInput | QuotaWhereInput[]
    title?: StringFilter<"Quota"> | string
    size?: IntNullableFilter<"Quota"> | number | null
    sortId?: IntFilter<"Quota"> | number
    eventId?: IntFilter<"Quota"> | number
    Event?: XOR<EventScalarRelationFilter, EventWhereInput>
    Signups?: SignupListRelationFilter
    OriginalSignups?: SignupListRelationFilter
  }, "id">

  export type QuotaOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    size?: SortOrderInput | SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
    _count?: QuotaCountOrderByAggregateInput
    _avg?: QuotaAvgOrderByAggregateInput
    _max?: QuotaMaxOrderByAggregateInput
    _min?: QuotaMinOrderByAggregateInput
    _sum?: QuotaSumOrderByAggregateInput
  }

  export type QuotaScalarWhereWithAggregatesInput = {
    AND?: QuotaScalarWhereWithAggregatesInput | QuotaScalarWhereWithAggregatesInput[]
    OR?: QuotaScalarWhereWithAggregatesInput[]
    NOT?: QuotaScalarWhereWithAggregatesInput | QuotaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quota"> | string
    title?: StringWithAggregatesFilter<"Quota"> | string
    size?: IntNullableWithAggregatesFilter<"Quota"> | number | null
    sortId?: IntWithAggregatesFilter<"Quota"> | number
    eventId?: IntWithAggregatesFilter<"Quota"> | number
  }

  export type ExampleCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExampleUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExampleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExampleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExampleCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExampleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExampleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type EmailVerificationTokenUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type EmailVerificationTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type EmailVerificationTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type EmailVerificationTokenCreateManyInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type EmailVerificationTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type EmailVerificationTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type PasswordChangeTokenCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type PasswordChangeTokenUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type PasswordChangeTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type PasswordChangeTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type PasswordChangeTokenCreateManyInput = {
    id?: string
    createdAt?: Date | string
    expiresAt: Date | string
    email: string
  }

  export type PasswordChangeTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type PasswordChangeTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type EventCreateInput = {
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionCreateNestedManyWithoutEventInput
    Quotas?: QuotaCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: number
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionUncheckedCreateNestedManyWithoutEventInput
    Quotas?: QuotaUncheckedCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUpdateManyWithoutEventNestedInput
    Quotas?: QuotaUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUncheckedUpdateManyWithoutEventNestedInput
    Quotas?: QuotaUncheckedUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: number
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
  }

  export type EventUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
  }

  export type EventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
  }

  export type QuestionCreateInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    Event: EventCreateNestedOneWithoutQuestionsInput
    Answers?: AnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    eventId: number
    Answers?: AnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    Event?: EventUpdateOneRequiredWithoutQuestionsNestedInput
    Answers?: AnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    eventId?: IntFieldUpdateOperationsInput | number
    Answers?: AnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionCreateManyInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    eventId: number
  }

  export type QuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    eventId?: IntFieldUpdateOperationsInput | number
  }

  export type AnswerCreateInput = {
    id?: string
    answer: string
    Question: QuestionCreateNestedOneWithoutAnswersInput
    Signup: SignupCreateNestedOneWithoutAnswersInput
  }

  export type AnswerUncheckedCreateInput = {
    id?: string
    answer: string
    questionId: string
    signupId: string
  }

  export type AnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    Question?: QuestionUpdateOneRequiredWithoutAnswersNestedInput
    Signup?: SignupUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type AnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    signupId?: StringFieldUpdateOperationsInput | string
  }

  export type AnswerCreateManyInput = {
    id?: string
    answer: string
    questionId: string
    signupId: string
  }

  export type AnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
  }

  export type AnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    signupId?: StringFieldUpdateOperationsInput | string
  }

  export type SignupCreateInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Quota: QuotaCreateNestedOneWithoutSignupsInput
    OriginalQuota: QuotaCreateNestedOneWithoutOriginalSignupsInput
    Answers?: AnswerCreateNestedManyWithoutSignupInput
  }

  export type SignupUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    quotaId: string
    originalQuotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Answers?: AnswerUncheckedCreateNestedManyWithoutSignupInput
  }

  export type SignupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Quota?: QuotaUpdateOneRequiredWithoutSignupsNestedInput
    OriginalQuota?: QuotaUpdateOneRequiredWithoutOriginalSignupsNestedInput
    Answers?: AnswerUpdateManyWithoutSignupNestedInput
  }

  export type SignupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotaId?: StringFieldUpdateOperationsInput | string
    originalQuotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Answers?: AnswerUncheckedUpdateManyWithoutSignupNestedInput
  }

  export type SignupCreateManyInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    quotaId: string
    originalQuotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
  }

  export type SignupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
  }

  export type SignupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotaId?: StringFieldUpdateOperationsInput | string
    originalQuotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
  }

  export type RaffleSimulationCreateInput = {
    id?: string
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    event: EventCreateNestedOneWithoutRaffleSimulationsInput
  }

  export type RaffleSimulationUncheckedCreateInput = {
    id?: string
    eventId: number
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RaffleSimulationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutRaffleSimulationsNestedInput
  }

  export type RaffleSimulationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleSimulationCreateManyInput = {
    id?: string
    eventId: number
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RaffleSimulationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleSimulationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotaCreateInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    Event: EventCreateNestedOneWithoutQuotasInput
    Signups?: SignupCreateNestedManyWithoutQuotaInput
    OriginalSignups?: SignupCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaUncheckedCreateInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    eventId: number
    Signups?: SignupUncheckedCreateNestedManyWithoutQuotaInput
    OriginalSignups?: SignupUncheckedCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    Event?: EventUpdateOneRequiredWithoutQuotasNestedInput
    Signups?: SignupUpdateManyWithoutQuotaNestedInput
    OriginalSignups?: SignupUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    Signups?: SignupUncheckedUpdateManyWithoutQuotaNestedInput
    OriginalSignups?: SignupUncheckedUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaCreateManyInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    eventId: number
  }

  export type QuotaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
  }

  export type QuotaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ExampleCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExampleMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExampleMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmailVerificationTokenCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type EmailVerificationTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type EmailVerificationTokenMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type PasswordChangeTokenCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type PasswordChangeTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type PasswordChangeTokenMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumRaffleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RaffleStatus | EnumRaffleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRaffleStatusFilter<$PrismaModel> | $Enums.RaffleStatus
  }

  export type QuestionListRelationFilter = {
    every?: QuestionWhereInput
    some?: QuestionWhereInput
    none?: QuestionWhereInput
  }

  export type QuotaListRelationFilter = {
    every?: QuotaWhereInput
    some?: QuotaWhereInput
    none?: QuotaWhereInput
  }

  export type RaffleSimulationListRelationFilter = {
    every?: RaffleSimulationWhereInput
    some?: RaffleSimulationWhereInput
    none?: RaffleSimulationWhereInput
  }

  export type QuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuotaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RaffleSimulationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    openQuotaSize?: SortOrder
    description?: SortOrder
    price?: SortOrder
    location?: SortOrder
    webpageUrl?: SortOrder
    draft?: SortOrder
    signupsPublic?: SortOrder
    verificationEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    raffleEnabled?: SortOrder
    raffleStartTime?: SortOrder
    raffleEndTime?: SortOrder
    raffleStatus?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    id?: SortOrder
    openQuotaSize?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    openQuotaSize?: SortOrder
    description?: SortOrder
    price?: SortOrder
    location?: SortOrder
    webpageUrl?: SortOrder
    draft?: SortOrder
    signupsPublic?: SortOrder
    verificationEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    raffleEnabled?: SortOrder
    raffleStartTime?: SortOrder
    raffleEndTime?: SortOrder
    raffleStatus?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    registrationStartDate?: SortOrder
    registrationEndDate?: SortOrder
    openQuotaSize?: SortOrder
    description?: SortOrder
    price?: SortOrder
    location?: SortOrder
    webpageUrl?: SortOrder
    draft?: SortOrder
    signupsPublic?: SortOrder
    verificationEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    raffleEnabled?: SortOrder
    raffleStartTime?: SortOrder
    raffleEndTime?: SortOrder
    raffleStatus?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    id?: SortOrder
    openQuotaSize?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumRaffleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RaffleStatus | EnumRaffleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRaffleStatusWithAggregatesFilter<$PrismaModel> | $Enums.RaffleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRaffleStatusFilter<$PrismaModel>
    _max?: NestedEnumRaffleStatusFilter<$PrismaModel>
  }

  export type EnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EventScalarRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type AnswerListRelationFilter = {
    every?: AnswerWhereInput
    some?: AnswerWhereInput
    none?: AnswerWhereInput
  }

  export type AnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    type?: SortOrder
    sortId?: SortOrder
    options?: SortOrder
    required?: SortOrder
    public?: SortOrder
    eventId?: SortOrder
  }

  export type QuestionAvgOrderByAggregateInput = {
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    type?: SortOrder
    sortId?: SortOrder
    required?: SortOrder
    public?: SortOrder
    eventId?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    type?: SortOrder
    sortId?: SortOrder
    required?: SortOrder
    public?: SortOrder
    eventId?: SortOrder
  }

  export type QuestionSumOrderByAggregateInput = {
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type EnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type QuestionScalarRelationFilter = {
    is?: QuestionWhereInput
    isNot?: QuestionWhereInput
  }

  export type SignupScalarRelationFilter = {
    is?: SignupWhereInput
    isNot?: SignupWhereInput
  }

  export type AnswerSignup_and_questionCompoundUniqueInput = {
    signupId: string
    questionId: string
  }

  export type AnswerCountOrderByAggregateInput = {
    id?: SortOrder
    answer?: SortOrder
    questionId?: SortOrder
    signupId?: SortOrder
  }

  export type AnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    answer?: SortOrder
    questionId?: SortOrder
    signupId?: SortOrder
  }

  export type AnswerMinOrderByAggregateInput = {
    id?: SortOrder
    answer?: SortOrder
    questionId?: SortOrder
    signupId?: SortOrder
  }

  export type EnumSignupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SignupStatus | EnumSignupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSignupStatusFilter<$PrismaModel> | $Enums.SignupStatus
  }

  export type QuotaScalarRelationFilter = {
    is?: QuotaWhereInput
    isNot?: QuotaWhereInput
  }

  export type SignupCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    quotaId?: SortOrder
    originalQuotaId?: SortOrder
    registrationIntent?: SortOrder
    status?: SortOrder
  }

  export type SignupMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    quotaId?: SortOrder
    originalQuotaId?: SortOrder
    registrationIntent?: SortOrder
    status?: SortOrder
  }

  export type SignupMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    quotaId?: SortOrder
    originalQuotaId?: SortOrder
    registrationIntent?: SortOrder
    status?: SortOrder
  }

  export type EnumSignupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SignupStatus | EnumSignupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSignupStatusWithAggregatesFilter<$PrismaModel> | $Enums.SignupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSignupStatusFilter<$PrismaModel>
    _max?: NestedEnumSignupStatusFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RaffleSimulationCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    seed?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    physicsState?: SortOrder
    createdAt?: SortOrder
  }

  export type RaffleSimulationAvgOrderByAggregateInput = {
    eventId?: SortOrder
  }

  export type RaffleSimulationMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    seed?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
  }

  export type RaffleSimulationMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    seed?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
  }

  export type RaffleSimulationSumOrderByAggregateInput = {
    eventId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SignupListRelationFilter = {
    every?: SignupWhereInput
    some?: SignupWhereInput
    none?: SignupWhereInput
  }

  export type SignupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuotaCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    size?: SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type QuotaAvgOrderByAggregateInput = {
    size?: SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type QuotaMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    size?: SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type QuotaMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    size?: SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type QuotaSumOrderByAggregateInput = {
    size?: SortOrder
    sortId?: SortOrder
    eventId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type QuestionCreateNestedManyWithoutEventInput = {
    create?: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput> | QuestionCreateWithoutEventInput[] | QuestionUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutEventInput | QuestionCreateOrConnectWithoutEventInput[]
    createMany?: QuestionCreateManyEventInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type QuotaCreateNestedManyWithoutEventInput = {
    create?: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput> | QuotaCreateWithoutEventInput[] | QuotaUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuotaCreateOrConnectWithoutEventInput | QuotaCreateOrConnectWithoutEventInput[]
    createMany?: QuotaCreateManyEventInputEnvelope
    connect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
  }

  export type RaffleSimulationCreateNestedManyWithoutEventInput = {
    create?: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput> | RaffleSimulationCreateWithoutEventInput[] | RaffleSimulationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: RaffleSimulationCreateOrConnectWithoutEventInput | RaffleSimulationCreateOrConnectWithoutEventInput[]
    createMany?: RaffleSimulationCreateManyEventInputEnvelope
    connect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
  }

  export type QuestionUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput> | QuestionCreateWithoutEventInput[] | QuestionUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutEventInput | QuestionCreateOrConnectWithoutEventInput[]
    createMany?: QuestionCreateManyEventInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type QuotaUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput> | QuotaCreateWithoutEventInput[] | QuotaUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuotaCreateOrConnectWithoutEventInput | QuotaCreateOrConnectWithoutEventInput[]
    createMany?: QuotaCreateManyEventInputEnvelope
    connect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
  }

  export type RaffleSimulationUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput> | RaffleSimulationCreateWithoutEventInput[] | RaffleSimulationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: RaffleSimulationCreateOrConnectWithoutEventInput | RaffleSimulationCreateOrConnectWithoutEventInput[]
    createMany?: RaffleSimulationCreateManyEventInputEnvelope
    connect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumRaffleStatusFieldUpdateOperationsInput = {
    set?: $Enums.RaffleStatus
  }

  export type QuestionUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput> | QuestionCreateWithoutEventInput[] | QuestionUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutEventInput | QuestionCreateOrConnectWithoutEventInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutEventInput | QuestionUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuestionCreateManyEventInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutEventInput | QuestionUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutEventInput | QuestionUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuotaUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput> | QuotaCreateWithoutEventInput[] | QuotaUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuotaCreateOrConnectWithoutEventInput | QuotaCreateOrConnectWithoutEventInput[]
    upsert?: QuotaUpsertWithWhereUniqueWithoutEventInput | QuotaUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuotaCreateManyEventInputEnvelope
    set?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    disconnect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    delete?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    connect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    update?: QuotaUpdateWithWhereUniqueWithoutEventInput | QuotaUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuotaUpdateManyWithWhereWithoutEventInput | QuotaUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuotaScalarWhereInput | QuotaScalarWhereInput[]
  }

  export type RaffleSimulationUpdateManyWithoutEventNestedInput = {
    create?: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput> | RaffleSimulationCreateWithoutEventInput[] | RaffleSimulationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: RaffleSimulationCreateOrConnectWithoutEventInput | RaffleSimulationCreateOrConnectWithoutEventInput[]
    upsert?: RaffleSimulationUpsertWithWhereUniqueWithoutEventInput | RaffleSimulationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: RaffleSimulationCreateManyEventInputEnvelope
    set?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    disconnect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    delete?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    connect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    update?: RaffleSimulationUpdateWithWhereUniqueWithoutEventInput | RaffleSimulationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: RaffleSimulationUpdateManyWithWhereWithoutEventInput | RaffleSimulationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: RaffleSimulationScalarWhereInput | RaffleSimulationScalarWhereInput[]
  }

  export type QuestionUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput> | QuestionCreateWithoutEventInput[] | QuestionUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutEventInput | QuestionCreateOrConnectWithoutEventInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutEventInput | QuestionUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuestionCreateManyEventInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutEventInput | QuestionUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutEventInput | QuestionUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuotaUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput> | QuotaCreateWithoutEventInput[] | QuotaUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuotaCreateOrConnectWithoutEventInput | QuotaCreateOrConnectWithoutEventInput[]
    upsert?: QuotaUpsertWithWhereUniqueWithoutEventInput | QuotaUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuotaCreateManyEventInputEnvelope
    set?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    disconnect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    delete?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    connect?: QuotaWhereUniqueInput | QuotaWhereUniqueInput[]
    update?: QuotaUpdateWithWhereUniqueWithoutEventInput | QuotaUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuotaUpdateManyWithWhereWithoutEventInput | QuotaUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuotaScalarWhereInput | QuotaScalarWhereInput[]
  }

  export type RaffleSimulationUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput> | RaffleSimulationCreateWithoutEventInput[] | RaffleSimulationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: RaffleSimulationCreateOrConnectWithoutEventInput | RaffleSimulationCreateOrConnectWithoutEventInput[]
    upsert?: RaffleSimulationUpsertWithWhereUniqueWithoutEventInput | RaffleSimulationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: RaffleSimulationCreateManyEventInputEnvelope
    set?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    disconnect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    delete?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    connect?: RaffleSimulationWhereUniqueInput | RaffleSimulationWhereUniqueInput[]
    update?: RaffleSimulationUpdateWithWhereUniqueWithoutEventInput | RaffleSimulationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: RaffleSimulationUpdateManyWithWhereWithoutEventInput | RaffleSimulationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: RaffleSimulationScalarWhereInput | RaffleSimulationScalarWhereInput[]
  }

  export type QuestionCreateoptionsInput = {
    set: string[]
  }

  export type EventCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<EventCreateWithoutQuestionsInput, EventUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: EventCreateOrConnectWithoutQuestionsInput
    connect?: EventWhereUniqueInput
  }

  export type AnswerCreateNestedManyWithoutQuestionInput = {
    create?: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput> | AnswerCreateWithoutQuestionInput[] | AnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutQuestionInput | AnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: AnswerCreateManyQuestionInputEnvelope
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
  }

  export type AnswerUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput> | AnswerCreateWithoutQuestionInput[] | AnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutQuestionInput | AnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: AnswerCreateManyQuestionInputEnvelope
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
  }

  export type EnumQuestionTypeFieldUpdateOperationsInput = {
    set?: $Enums.QuestionType
  }

  export type QuestionUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EventUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<EventCreateWithoutQuestionsInput, EventUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: EventCreateOrConnectWithoutQuestionsInput
    upsert?: EventUpsertWithoutQuestionsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutQuestionsInput, EventUpdateWithoutQuestionsInput>, EventUncheckedUpdateWithoutQuestionsInput>
  }

  export type AnswerUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput> | AnswerCreateWithoutQuestionInput[] | AnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutQuestionInput | AnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: AnswerUpsertWithWhereUniqueWithoutQuestionInput | AnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: AnswerCreateManyQuestionInputEnvelope
    set?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    disconnect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    delete?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    update?: AnswerUpdateWithWhereUniqueWithoutQuestionInput | AnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: AnswerUpdateManyWithWhereWithoutQuestionInput | AnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
  }

  export type AnswerUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput> | AnswerCreateWithoutQuestionInput[] | AnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutQuestionInput | AnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: AnswerUpsertWithWhereUniqueWithoutQuestionInput | AnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: AnswerCreateManyQuestionInputEnvelope
    set?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    disconnect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    delete?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    update?: AnswerUpdateWithWhereUniqueWithoutQuestionInput | AnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: AnswerUpdateManyWithWhereWithoutQuestionInput | AnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
  }

  export type QuestionCreateNestedOneWithoutAnswersInput = {
    create?: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutAnswersInput
    connect?: QuestionWhereUniqueInput
  }

  export type SignupCreateNestedOneWithoutAnswersInput = {
    create?: XOR<SignupCreateWithoutAnswersInput, SignupUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: SignupCreateOrConnectWithoutAnswersInput
    connect?: SignupWhereUniqueInput
  }

  export type QuestionUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutAnswersInput
    upsert?: QuestionUpsertWithoutAnswersInput
    connect?: QuestionWhereUniqueInput
    update?: XOR<XOR<QuestionUpdateToOneWithWhereWithoutAnswersInput, QuestionUpdateWithoutAnswersInput>, QuestionUncheckedUpdateWithoutAnswersInput>
  }

  export type SignupUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<SignupCreateWithoutAnswersInput, SignupUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: SignupCreateOrConnectWithoutAnswersInput
    upsert?: SignupUpsertWithoutAnswersInput
    connect?: SignupWhereUniqueInput
    update?: XOR<XOR<SignupUpdateToOneWithWhereWithoutAnswersInput, SignupUpdateWithoutAnswersInput>, SignupUncheckedUpdateWithoutAnswersInput>
  }

  export type QuotaCreateNestedOneWithoutSignupsInput = {
    create?: XOR<QuotaCreateWithoutSignupsInput, QuotaUncheckedCreateWithoutSignupsInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutSignupsInput
    connect?: QuotaWhereUniqueInput
  }

  export type QuotaCreateNestedOneWithoutOriginalSignupsInput = {
    create?: XOR<QuotaCreateWithoutOriginalSignupsInput, QuotaUncheckedCreateWithoutOriginalSignupsInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutOriginalSignupsInput
    connect?: QuotaWhereUniqueInput
  }

  export type AnswerCreateNestedManyWithoutSignupInput = {
    create?: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput> | AnswerCreateWithoutSignupInput[] | AnswerUncheckedCreateWithoutSignupInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutSignupInput | AnswerCreateOrConnectWithoutSignupInput[]
    createMany?: AnswerCreateManySignupInputEnvelope
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
  }

  export type AnswerUncheckedCreateNestedManyWithoutSignupInput = {
    create?: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput> | AnswerCreateWithoutSignupInput[] | AnswerUncheckedCreateWithoutSignupInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutSignupInput | AnswerCreateOrConnectWithoutSignupInput[]
    createMany?: AnswerCreateManySignupInputEnvelope
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
  }

  export type EnumSignupStatusFieldUpdateOperationsInput = {
    set?: $Enums.SignupStatus
  }

  export type QuotaUpdateOneRequiredWithoutSignupsNestedInput = {
    create?: XOR<QuotaCreateWithoutSignupsInput, QuotaUncheckedCreateWithoutSignupsInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutSignupsInput
    upsert?: QuotaUpsertWithoutSignupsInput
    connect?: QuotaWhereUniqueInput
    update?: XOR<XOR<QuotaUpdateToOneWithWhereWithoutSignupsInput, QuotaUpdateWithoutSignupsInput>, QuotaUncheckedUpdateWithoutSignupsInput>
  }

  export type QuotaUpdateOneRequiredWithoutOriginalSignupsNestedInput = {
    create?: XOR<QuotaCreateWithoutOriginalSignupsInput, QuotaUncheckedCreateWithoutOriginalSignupsInput>
    connectOrCreate?: QuotaCreateOrConnectWithoutOriginalSignupsInput
    upsert?: QuotaUpsertWithoutOriginalSignupsInput
    connect?: QuotaWhereUniqueInput
    update?: XOR<XOR<QuotaUpdateToOneWithWhereWithoutOriginalSignupsInput, QuotaUpdateWithoutOriginalSignupsInput>, QuotaUncheckedUpdateWithoutOriginalSignupsInput>
  }

  export type AnswerUpdateManyWithoutSignupNestedInput = {
    create?: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput> | AnswerCreateWithoutSignupInput[] | AnswerUncheckedCreateWithoutSignupInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutSignupInput | AnswerCreateOrConnectWithoutSignupInput[]
    upsert?: AnswerUpsertWithWhereUniqueWithoutSignupInput | AnswerUpsertWithWhereUniqueWithoutSignupInput[]
    createMany?: AnswerCreateManySignupInputEnvelope
    set?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    disconnect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    delete?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    update?: AnswerUpdateWithWhereUniqueWithoutSignupInput | AnswerUpdateWithWhereUniqueWithoutSignupInput[]
    updateMany?: AnswerUpdateManyWithWhereWithoutSignupInput | AnswerUpdateManyWithWhereWithoutSignupInput[]
    deleteMany?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
  }

  export type AnswerUncheckedUpdateManyWithoutSignupNestedInput = {
    create?: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput> | AnswerCreateWithoutSignupInput[] | AnswerUncheckedCreateWithoutSignupInput[]
    connectOrCreate?: AnswerCreateOrConnectWithoutSignupInput | AnswerCreateOrConnectWithoutSignupInput[]
    upsert?: AnswerUpsertWithWhereUniqueWithoutSignupInput | AnswerUpsertWithWhereUniqueWithoutSignupInput[]
    createMany?: AnswerCreateManySignupInputEnvelope
    set?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    disconnect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    delete?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    connect?: AnswerWhereUniqueInput | AnswerWhereUniqueInput[]
    update?: AnswerUpdateWithWhereUniqueWithoutSignupInput | AnswerUpdateWithWhereUniqueWithoutSignupInput[]
    updateMany?: AnswerUpdateManyWithWhereWithoutSignupInput | AnswerUpdateManyWithWhereWithoutSignupInput[]
    deleteMany?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutRaffleSimulationsInput = {
    create?: XOR<EventCreateWithoutRaffleSimulationsInput, EventUncheckedCreateWithoutRaffleSimulationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutRaffleSimulationsInput
    connect?: EventWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutRaffleSimulationsNestedInput = {
    create?: XOR<EventCreateWithoutRaffleSimulationsInput, EventUncheckedCreateWithoutRaffleSimulationsInput>
    connectOrCreate?: EventCreateOrConnectWithoutRaffleSimulationsInput
    upsert?: EventUpsertWithoutRaffleSimulationsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutRaffleSimulationsInput, EventUpdateWithoutRaffleSimulationsInput>, EventUncheckedUpdateWithoutRaffleSimulationsInput>
  }

  export type EventCreateNestedOneWithoutQuotasInput = {
    create?: XOR<EventCreateWithoutQuotasInput, EventUncheckedCreateWithoutQuotasInput>
    connectOrCreate?: EventCreateOrConnectWithoutQuotasInput
    connect?: EventWhereUniqueInput
  }

  export type SignupCreateNestedManyWithoutQuotaInput = {
    create?: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput> | SignupCreateWithoutQuotaInput[] | SignupUncheckedCreateWithoutQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutQuotaInput | SignupCreateOrConnectWithoutQuotaInput[]
    createMany?: SignupCreateManyQuotaInputEnvelope
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
  }

  export type SignupCreateNestedManyWithoutOriginalQuotaInput = {
    create?: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput> | SignupCreateWithoutOriginalQuotaInput[] | SignupUncheckedCreateWithoutOriginalQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutOriginalQuotaInput | SignupCreateOrConnectWithoutOriginalQuotaInput[]
    createMany?: SignupCreateManyOriginalQuotaInputEnvelope
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
  }

  export type SignupUncheckedCreateNestedManyWithoutQuotaInput = {
    create?: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput> | SignupCreateWithoutQuotaInput[] | SignupUncheckedCreateWithoutQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutQuotaInput | SignupCreateOrConnectWithoutQuotaInput[]
    createMany?: SignupCreateManyQuotaInputEnvelope
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
  }

  export type SignupUncheckedCreateNestedManyWithoutOriginalQuotaInput = {
    create?: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput> | SignupCreateWithoutOriginalQuotaInput[] | SignupUncheckedCreateWithoutOriginalQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutOriginalQuotaInput | SignupCreateOrConnectWithoutOriginalQuotaInput[]
    createMany?: SignupCreateManyOriginalQuotaInputEnvelope
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EventUpdateOneRequiredWithoutQuotasNestedInput = {
    create?: XOR<EventCreateWithoutQuotasInput, EventUncheckedCreateWithoutQuotasInput>
    connectOrCreate?: EventCreateOrConnectWithoutQuotasInput
    upsert?: EventUpsertWithoutQuotasInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutQuotasInput, EventUpdateWithoutQuotasInput>, EventUncheckedUpdateWithoutQuotasInput>
  }

  export type SignupUpdateManyWithoutQuotaNestedInput = {
    create?: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput> | SignupCreateWithoutQuotaInput[] | SignupUncheckedCreateWithoutQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutQuotaInput | SignupCreateOrConnectWithoutQuotaInput[]
    upsert?: SignupUpsertWithWhereUniqueWithoutQuotaInput | SignupUpsertWithWhereUniqueWithoutQuotaInput[]
    createMany?: SignupCreateManyQuotaInputEnvelope
    set?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    disconnect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    delete?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    update?: SignupUpdateWithWhereUniqueWithoutQuotaInput | SignupUpdateWithWhereUniqueWithoutQuotaInput[]
    updateMany?: SignupUpdateManyWithWhereWithoutQuotaInput | SignupUpdateManyWithWhereWithoutQuotaInput[]
    deleteMany?: SignupScalarWhereInput | SignupScalarWhereInput[]
  }

  export type SignupUpdateManyWithoutOriginalQuotaNestedInput = {
    create?: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput> | SignupCreateWithoutOriginalQuotaInput[] | SignupUncheckedCreateWithoutOriginalQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutOriginalQuotaInput | SignupCreateOrConnectWithoutOriginalQuotaInput[]
    upsert?: SignupUpsertWithWhereUniqueWithoutOriginalQuotaInput | SignupUpsertWithWhereUniqueWithoutOriginalQuotaInput[]
    createMany?: SignupCreateManyOriginalQuotaInputEnvelope
    set?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    disconnect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    delete?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    update?: SignupUpdateWithWhereUniqueWithoutOriginalQuotaInput | SignupUpdateWithWhereUniqueWithoutOriginalQuotaInput[]
    updateMany?: SignupUpdateManyWithWhereWithoutOriginalQuotaInput | SignupUpdateManyWithWhereWithoutOriginalQuotaInput[]
    deleteMany?: SignupScalarWhereInput | SignupScalarWhereInput[]
  }

  export type SignupUncheckedUpdateManyWithoutQuotaNestedInput = {
    create?: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput> | SignupCreateWithoutQuotaInput[] | SignupUncheckedCreateWithoutQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutQuotaInput | SignupCreateOrConnectWithoutQuotaInput[]
    upsert?: SignupUpsertWithWhereUniqueWithoutQuotaInput | SignupUpsertWithWhereUniqueWithoutQuotaInput[]
    createMany?: SignupCreateManyQuotaInputEnvelope
    set?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    disconnect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    delete?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    update?: SignupUpdateWithWhereUniqueWithoutQuotaInput | SignupUpdateWithWhereUniqueWithoutQuotaInput[]
    updateMany?: SignupUpdateManyWithWhereWithoutQuotaInput | SignupUpdateManyWithWhereWithoutQuotaInput[]
    deleteMany?: SignupScalarWhereInput | SignupScalarWhereInput[]
  }

  export type SignupUncheckedUpdateManyWithoutOriginalQuotaNestedInput = {
    create?: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput> | SignupCreateWithoutOriginalQuotaInput[] | SignupUncheckedCreateWithoutOriginalQuotaInput[]
    connectOrCreate?: SignupCreateOrConnectWithoutOriginalQuotaInput | SignupCreateOrConnectWithoutOriginalQuotaInput[]
    upsert?: SignupUpsertWithWhereUniqueWithoutOriginalQuotaInput | SignupUpsertWithWhereUniqueWithoutOriginalQuotaInput[]
    createMany?: SignupCreateManyOriginalQuotaInputEnvelope
    set?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    disconnect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    delete?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    connect?: SignupWhereUniqueInput | SignupWhereUniqueInput[]
    update?: SignupUpdateWithWhereUniqueWithoutOriginalQuotaInput | SignupUpdateWithWhereUniqueWithoutOriginalQuotaInput[]
    updateMany?: SignupUpdateManyWithWhereWithoutOriginalQuotaInput | SignupUpdateManyWithWhereWithoutOriginalQuotaInput[]
    deleteMany?: SignupScalarWhereInput | SignupScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRaffleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RaffleStatus | EnumRaffleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRaffleStatusFilter<$PrismaModel> | $Enums.RaffleStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumRaffleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RaffleStatus | EnumRaffleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RaffleStatus[] | ListEnumRaffleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRaffleStatusWithAggregatesFilter<$PrismaModel> | $Enums.RaffleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRaffleStatusFilter<$PrismaModel>
    _max?: NestedEnumRaffleStatusFilter<$PrismaModel>
  }

  export type NestedEnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type NestedEnumSignupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SignupStatus | EnumSignupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSignupStatusFilter<$PrismaModel> | $Enums.SignupStatus
  }

  export type NestedEnumSignupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SignupStatus | EnumSignupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SignupStatus[] | ListEnumSignupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSignupStatusWithAggregatesFilter<$PrismaModel> | $Enums.SignupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSignupStatusFilter<$PrismaModel>
    _max?: NestedEnumSignupStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type QuestionCreateWithoutEventInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    Answers?: AnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateWithoutEventInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    Answers?: AnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionCreateOrConnectWithoutEventInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput>
  }

  export type QuestionCreateManyEventInputEnvelope = {
    data: QuestionCreateManyEventInput | QuestionCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type QuotaCreateWithoutEventInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    Signups?: SignupCreateNestedManyWithoutQuotaInput
    OriginalSignups?: SignupCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaUncheckedCreateWithoutEventInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    Signups?: SignupUncheckedCreateNestedManyWithoutQuotaInput
    OriginalSignups?: SignupUncheckedCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaCreateOrConnectWithoutEventInput = {
    where: QuotaWhereUniqueInput
    create: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput>
  }

  export type QuotaCreateManyEventInputEnvelope = {
    data: QuotaCreateManyEventInput | QuotaCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type RaffleSimulationCreateWithoutEventInput = {
    id?: string
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RaffleSimulationUncheckedCreateWithoutEventInput = {
    id?: string
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RaffleSimulationCreateOrConnectWithoutEventInput = {
    where: RaffleSimulationWhereUniqueInput
    create: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput>
  }

  export type RaffleSimulationCreateManyEventInputEnvelope = {
    data: RaffleSimulationCreateManyEventInput | RaffleSimulationCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type QuestionUpsertWithWhereUniqueWithoutEventInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutEventInput, QuestionUncheckedUpdateWithoutEventInput>
    create: XOR<QuestionCreateWithoutEventInput, QuestionUncheckedCreateWithoutEventInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutEventInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutEventInput, QuestionUncheckedUpdateWithoutEventInput>
  }

  export type QuestionUpdateManyWithWhereWithoutEventInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutEventInput>
  }

  export type QuestionScalarWhereInput = {
    AND?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    OR?: QuestionScalarWhereInput[]
    NOT?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    id?: StringFilter<"Question"> | string
    question?: StringFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    sortId?: IntFilter<"Question"> | number
    options?: StringNullableListFilter<"Question">
    required?: BoolFilter<"Question"> | boolean
    public?: BoolFilter<"Question"> | boolean
    eventId?: IntFilter<"Question"> | number
  }

  export type QuotaUpsertWithWhereUniqueWithoutEventInput = {
    where: QuotaWhereUniqueInput
    update: XOR<QuotaUpdateWithoutEventInput, QuotaUncheckedUpdateWithoutEventInput>
    create: XOR<QuotaCreateWithoutEventInput, QuotaUncheckedCreateWithoutEventInput>
  }

  export type QuotaUpdateWithWhereUniqueWithoutEventInput = {
    where: QuotaWhereUniqueInput
    data: XOR<QuotaUpdateWithoutEventInput, QuotaUncheckedUpdateWithoutEventInput>
  }

  export type QuotaUpdateManyWithWhereWithoutEventInput = {
    where: QuotaScalarWhereInput
    data: XOR<QuotaUpdateManyMutationInput, QuotaUncheckedUpdateManyWithoutEventInput>
  }

  export type QuotaScalarWhereInput = {
    AND?: QuotaScalarWhereInput | QuotaScalarWhereInput[]
    OR?: QuotaScalarWhereInput[]
    NOT?: QuotaScalarWhereInput | QuotaScalarWhereInput[]
    id?: StringFilter<"Quota"> | string
    title?: StringFilter<"Quota"> | string
    size?: IntNullableFilter<"Quota"> | number | null
    sortId?: IntFilter<"Quota"> | number
    eventId?: IntFilter<"Quota"> | number
  }

  export type RaffleSimulationUpsertWithWhereUniqueWithoutEventInput = {
    where: RaffleSimulationWhereUniqueInput
    update: XOR<RaffleSimulationUpdateWithoutEventInput, RaffleSimulationUncheckedUpdateWithoutEventInput>
    create: XOR<RaffleSimulationCreateWithoutEventInput, RaffleSimulationUncheckedCreateWithoutEventInput>
  }

  export type RaffleSimulationUpdateWithWhereUniqueWithoutEventInput = {
    where: RaffleSimulationWhereUniqueInput
    data: XOR<RaffleSimulationUpdateWithoutEventInput, RaffleSimulationUncheckedUpdateWithoutEventInput>
  }

  export type RaffleSimulationUpdateManyWithWhereWithoutEventInput = {
    where: RaffleSimulationScalarWhereInput
    data: XOR<RaffleSimulationUpdateManyMutationInput, RaffleSimulationUncheckedUpdateManyWithoutEventInput>
  }

  export type RaffleSimulationScalarWhereInput = {
    AND?: RaffleSimulationScalarWhereInput | RaffleSimulationScalarWhereInput[]
    OR?: RaffleSimulationScalarWhereInput[]
    NOT?: RaffleSimulationScalarWhereInput | RaffleSimulationScalarWhereInput[]
    id?: StringFilter<"RaffleSimulation"> | string
    eventId?: IntFilter<"RaffleSimulation"> | number
    seed?: StringFilter<"RaffleSimulation"> | string
    startTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    endTime?: DateTimeFilter<"RaffleSimulation"> | Date | string
    physicsState?: JsonFilter<"RaffleSimulation">
    createdAt?: DateTimeFilter<"RaffleSimulation"> | Date | string
  }

  export type EventCreateWithoutQuestionsInput = {
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Quotas?: QuotaCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutQuestionsInput = {
    id?: number
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Quotas?: QuotaUncheckedCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutQuestionsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutQuestionsInput, EventUncheckedCreateWithoutQuestionsInput>
  }

  export type AnswerCreateWithoutQuestionInput = {
    id?: string
    answer: string
    Signup: SignupCreateNestedOneWithoutAnswersInput
  }

  export type AnswerUncheckedCreateWithoutQuestionInput = {
    id?: string
    answer: string
    signupId: string
  }

  export type AnswerCreateOrConnectWithoutQuestionInput = {
    where: AnswerWhereUniqueInput
    create: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput>
  }

  export type AnswerCreateManyQuestionInputEnvelope = {
    data: AnswerCreateManyQuestionInput | AnswerCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithoutQuestionsInput = {
    update: XOR<EventUpdateWithoutQuestionsInput, EventUncheckedUpdateWithoutQuestionsInput>
    create: XOR<EventCreateWithoutQuestionsInput, EventUncheckedCreateWithoutQuestionsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutQuestionsInput, EventUncheckedUpdateWithoutQuestionsInput>
  }

  export type EventUpdateWithoutQuestionsInput = {
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Quotas?: QuotaUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutQuestionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Quotas?: QuotaUncheckedUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type AnswerUpsertWithWhereUniqueWithoutQuestionInput = {
    where: AnswerWhereUniqueInput
    update: XOR<AnswerUpdateWithoutQuestionInput, AnswerUncheckedUpdateWithoutQuestionInput>
    create: XOR<AnswerCreateWithoutQuestionInput, AnswerUncheckedCreateWithoutQuestionInput>
  }

  export type AnswerUpdateWithWhereUniqueWithoutQuestionInput = {
    where: AnswerWhereUniqueInput
    data: XOR<AnswerUpdateWithoutQuestionInput, AnswerUncheckedUpdateWithoutQuestionInput>
  }

  export type AnswerUpdateManyWithWhereWithoutQuestionInput = {
    where: AnswerScalarWhereInput
    data: XOR<AnswerUpdateManyMutationInput, AnswerUncheckedUpdateManyWithoutQuestionInput>
  }

  export type AnswerScalarWhereInput = {
    AND?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
    OR?: AnswerScalarWhereInput[]
    NOT?: AnswerScalarWhereInput | AnswerScalarWhereInput[]
    id?: StringFilter<"Answer"> | string
    answer?: StringFilter<"Answer"> | string
    questionId?: StringFilter<"Answer"> | string
    signupId?: StringFilter<"Answer"> | string
  }

  export type QuestionCreateWithoutAnswersInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    Event: EventCreateNestedOneWithoutQuestionsInput
  }

  export type QuestionUncheckedCreateWithoutAnswersInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
    eventId: number
  }

  export type QuestionCreateOrConnectWithoutAnswersInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
  }

  export type SignupCreateWithoutAnswersInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Quota: QuotaCreateNestedOneWithoutSignupsInput
    OriginalQuota: QuotaCreateNestedOneWithoutOriginalSignupsInput
  }

  export type SignupUncheckedCreateWithoutAnswersInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    quotaId: string
    originalQuotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
  }

  export type SignupCreateOrConnectWithoutAnswersInput = {
    where: SignupWhereUniqueInput
    create: XOR<SignupCreateWithoutAnswersInput, SignupUncheckedCreateWithoutAnswersInput>
  }

  export type QuestionUpsertWithoutAnswersInput = {
    update: XOR<QuestionUpdateWithoutAnswersInput, QuestionUncheckedUpdateWithoutAnswersInput>
    create: XOR<QuestionCreateWithoutAnswersInput, QuestionUncheckedCreateWithoutAnswersInput>
    where?: QuestionWhereInput
  }

  export type QuestionUpdateToOneWithWhereWithoutAnswersInput = {
    where?: QuestionWhereInput
    data: XOR<QuestionUpdateWithoutAnswersInput, QuestionUncheckedUpdateWithoutAnswersInput>
  }

  export type QuestionUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    Event?: EventUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type QuestionUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    eventId?: IntFieldUpdateOperationsInput | number
  }

  export type SignupUpsertWithoutAnswersInput = {
    update: XOR<SignupUpdateWithoutAnswersInput, SignupUncheckedUpdateWithoutAnswersInput>
    create: XOR<SignupCreateWithoutAnswersInput, SignupUncheckedCreateWithoutAnswersInput>
    where?: SignupWhereInput
  }

  export type SignupUpdateToOneWithWhereWithoutAnswersInput = {
    where?: SignupWhereInput
    data: XOR<SignupUpdateWithoutAnswersInput, SignupUncheckedUpdateWithoutAnswersInput>
  }

  export type SignupUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Quota?: QuotaUpdateOneRequiredWithoutSignupsNestedInput
    OriginalQuota?: QuotaUpdateOneRequiredWithoutOriginalSignupsNestedInput
  }

  export type SignupUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotaId?: StringFieldUpdateOperationsInput | string
    originalQuotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
  }

  export type QuotaCreateWithoutSignupsInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    Event: EventCreateNestedOneWithoutQuotasInput
    OriginalSignups?: SignupCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaUncheckedCreateWithoutSignupsInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    eventId: number
    OriginalSignups?: SignupUncheckedCreateNestedManyWithoutOriginalQuotaInput
  }

  export type QuotaCreateOrConnectWithoutSignupsInput = {
    where: QuotaWhereUniqueInput
    create: XOR<QuotaCreateWithoutSignupsInput, QuotaUncheckedCreateWithoutSignupsInput>
  }

  export type QuotaCreateWithoutOriginalSignupsInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    Event: EventCreateNestedOneWithoutQuotasInput
    Signups?: SignupCreateNestedManyWithoutQuotaInput
  }

  export type QuotaUncheckedCreateWithoutOriginalSignupsInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
    eventId: number
    Signups?: SignupUncheckedCreateNestedManyWithoutQuotaInput
  }

  export type QuotaCreateOrConnectWithoutOriginalSignupsInput = {
    where: QuotaWhereUniqueInput
    create: XOR<QuotaCreateWithoutOriginalSignupsInput, QuotaUncheckedCreateWithoutOriginalSignupsInput>
  }

  export type AnswerCreateWithoutSignupInput = {
    id?: string
    answer: string
    Question: QuestionCreateNestedOneWithoutAnswersInput
  }

  export type AnswerUncheckedCreateWithoutSignupInput = {
    id?: string
    answer: string
    questionId: string
  }

  export type AnswerCreateOrConnectWithoutSignupInput = {
    where: AnswerWhereUniqueInput
    create: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput>
  }

  export type AnswerCreateManySignupInputEnvelope = {
    data: AnswerCreateManySignupInput | AnswerCreateManySignupInput[]
    skipDuplicates?: boolean
  }

  export type QuotaUpsertWithoutSignupsInput = {
    update: XOR<QuotaUpdateWithoutSignupsInput, QuotaUncheckedUpdateWithoutSignupsInput>
    create: XOR<QuotaCreateWithoutSignupsInput, QuotaUncheckedCreateWithoutSignupsInput>
    where?: QuotaWhereInput
  }

  export type QuotaUpdateToOneWithWhereWithoutSignupsInput = {
    where?: QuotaWhereInput
    data: XOR<QuotaUpdateWithoutSignupsInput, QuotaUncheckedUpdateWithoutSignupsInput>
  }

  export type QuotaUpdateWithoutSignupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    Event?: EventUpdateOneRequiredWithoutQuotasNestedInput
    OriginalSignups?: SignupUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaUncheckedUpdateWithoutSignupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    OriginalSignups?: SignupUncheckedUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaUpsertWithoutOriginalSignupsInput = {
    update: XOR<QuotaUpdateWithoutOriginalSignupsInput, QuotaUncheckedUpdateWithoutOriginalSignupsInput>
    create: XOR<QuotaCreateWithoutOriginalSignupsInput, QuotaUncheckedCreateWithoutOriginalSignupsInput>
    where?: QuotaWhereInput
  }

  export type QuotaUpdateToOneWithWhereWithoutOriginalSignupsInput = {
    where?: QuotaWhereInput
    data: XOR<QuotaUpdateWithoutOriginalSignupsInput, QuotaUncheckedUpdateWithoutOriginalSignupsInput>
  }

  export type QuotaUpdateWithoutOriginalSignupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    Event?: EventUpdateOneRequiredWithoutQuotasNestedInput
    Signups?: SignupUpdateManyWithoutQuotaNestedInput
  }

  export type QuotaUncheckedUpdateWithoutOriginalSignupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    eventId?: IntFieldUpdateOperationsInput | number
    Signups?: SignupUncheckedUpdateManyWithoutQuotaNestedInput
  }

  export type AnswerUpsertWithWhereUniqueWithoutSignupInput = {
    where: AnswerWhereUniqueInput
    update: XOR<AnswerUpdateWithoutSignupInput, AnswerUncheckedUpdateWithoutSignupInput>
    create: XOR<AnswerCreateWithoutSignupInput, AnswerUncheckedCreateWithoutSignupInput>
  }

  export type AnswerUpdateWithWhereUniqueWithoutSignupInput = {
    where: AnswerWhereUniqueInput
    data: XOR<AnswerUpdateWithoutSignupInput, AnswerUncheckedUpdateWithoutSignupInput>
  }

  export type AnswerUpdateManyWithWhereWithoutSignupInput = {
    where: AnswerScalarWhereInput
    data: XOR<AnswerUpdateManyMutationInput, AnswerUncheckedUpdateManyWithoutSignupInput>
  }

  export type EventCreateWithoutRaffleSimulationsInput = {
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionCreateNestedManyWithoutEventInput
    Quotas?: QuotaCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutRaffleSimulationsInput = {
    id?: number
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionUncheckedCreateNestedManyWithoutEventInput
    Quotas?: QuotaUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutRaffleSimulationsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutRaffleSimulationsInput, EventUncheckedCreateWithoutRaffleSimulationsInput>
  }

  export type EventUpsertWithoutRaffleSimulationsInput = {
    update: XOR<EventUpdateWithoutRaffleSimulationsInput, EventUncheckedUpdateWithoutRaffleSimulationsInput>
    create: XOR<EventCreateWithoutRaffleSimulationsInput, EventUncheckedCreateWithoutRaffleSimulationsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutRaffleSimulationsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutRaffleSimulationsInput, EventUncheckedUpdateWithoutRaffleSimulationsInput>
  }

  export type EventUpdateWithoutRaffleSimulationsInput = {
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUpdateManyWithoutEventNestedInput
    Quotas?: QuotaUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutRaffleSimulationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUncheckedUpdateManyWithoutEventNestedInput
    Quotas?: QuotaUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateWithoutQuotasInput = {
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutQuotasInput = {
    id?: number
    title: string
    date: Date | string
    registrationStartDate: Date | string
    registrationEndDate: Date | string
    openQuotaSize?: number
    description?: string | null
    price?: string | null
    location?: string | null
    webpageUrl?: string | null
    draft?: boolean
    signupsPublic?: boolean
    verificationEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    raffleEnabled?: boolean
    raffleStartTime?: Date | string | null
    raffleEndTime?: Date | string | null
    raffleStatus?: $Enums.RaffleStatus
    Questions?: QuestionUncheckedCreateNestedManyWithoutEventInput
    raffleSimulations?: RaffleSimulationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutQuotasInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutQuotasInput, EventUncheckedCreateWithoutQuotasInput>
  }

  export type SignupCreateWithoutQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    OriginalQuota: QuotaCreateNestedOneWithoutOriginalSignupsInput
    Answers?: AnswerCreateNestedManyWithoutSignupInput
  }

  export type SignupUncheckedCreateWithoutQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    originalQuotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Answers?: AnswerUncheckedCreateNestedManyWithoutSignupInput
  }

  export type SignupCreateOrConnectWithoutQuotaInput = {
    where: SignupWhereUniqueInput
    create: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput>
  }

  export type SignupCreateManyQuotaInputEnvelope = {
    data: SignupCreateManyQuotaInput | SignupCreateManyQuotaInput[]
    skipDuplicates?: boolean
  }

  export type SignupCreateWithoutOriginalQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Quota: QuotaCreateNestedOneWithoutSignupsInput
    Answers?: AnswerCreateNestedManyWithoutSignupInput
  }

  export type SignupUncheckedCreateWithoutOriginalQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    quotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
    Answers?: AnswerUncheckedCreateNestedManyWithoutSignupInput
  }

  export type SignupCreateOrConnectWithoutOriginalQuotaInput = {
    where: SignupWhereUniqueInput
    create: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput>
  }

  export type SignupCreateManyOriginalQuotaInputEnvelope = {
    data: SignupCreateManyOriginalQuotaInput | SignupCreateManyOriginalQuotaInput[]
    skipDuplicates?: boolean
  }

  export type EventUpsertWithoutQuotasInput = {
    update: XOR<EventUpdateWithoutQuotasInput, EventUncheckedUpdateWithoutQuotasInput>
    create: XOR<EventCreateWithoutQuotasInput, EventUncheckedCreateWithoutQuotasInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutQuotasInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutQuotasInput, EventUncheckedUpdateWithoutQuotasInput>
  }

  export type EventUpdateWithoutQuotasInput = {
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutQuotasInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationEndDate?: DateTimeFieldUpdateOperationsInput | Date | string
    openQuotaSize?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    webpageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    draft?: BoolFieldUpdateOperationsInput | boolean
    signupsPublic?: BoolFieldUpdateOperationsInput | boolean
    verificationEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEnabled?: BoolFieldUpdateOperationsInput | boolean
    raffleStartTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleEndTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    raffleStatus?: EnumRaffleStatusFieldUpdateOperationsInput | $Enums.RaffleStatus
    Questions?: QuestionUncheckedUpdateManyWithoutEventNestedInput
    raffleSimulations?: RaffleSimulationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type SignupUpsertWithWhereUniqueWithoutQuotaInput = {
    where: SignupWhereUniqueInput
    update: XOR<SignupUpdateWithoutQuotaInput, SignupUncheckedUpdateWithoutQuotaInput>
    create: XOR<SignupCreateWithoutQuotaInput, SignupUncheckedCreateWithoutQuotaInput>
  }

  export type SignupUpdateWithWhereUniqueWithoutQuotaInput = {
    where: SignupWhereUniqueInput
    data: XOR<SignupUpdateWithoutQuotaInput, SignupUncheckedUpdateWithoutQuotaInput>
  }

  export type SignupUpdateManyWithWhereWithoutQuotaInput = {
    where: SignupScalarWhereInput
    data: XOR<SignupUpdateManyMutationInput, SignupUncheckedUpdateManyWithoutQuotaInput>
  }

  export type SignupScalarWhereInput = {
    AND?: SignupScalarWhereInput | SignupScalarWhereInput[]
    OR?: SignupScalarWhereInput[]
    NOT?: SignupScalarWhereInput | SignupScalarWhereInput[]
    id?: StringFilter<"Signup"> | string
    name?: StringFilter<"Signup"> | string
    email?: StringFilter<"Signup"> | string
    completedAt?: DateTimeNullableFilter<"Signup"> | Date | string | null
    createdAt?: DateTimeFilter<"Signup"> | Date | string
    quotaId?: StringFilter<"Signup"> | string
    originalQuotaId?: StringFilter<"Signup"> | string
    registrationIntent?: DateTimeNullableFilter<"Signup"> | Date | string | null
    status?: EnumSignupStatusFilter<"Signup"> | $Enums.SignupStatus
  }

  export type SignupUpsertWithWhereUniqueWithoutOriginalQuotaInput = {
    where: SignupWhereUniqueInput
    update: XOR<SignupUpdateWithoutOriginalQuotaInput, SignupUncheckedUpdateWithoutOriginalQuotaInput>
    create: XOR<SignupCreateWithoutOriginalQuotaInput, SignupUncheckedCreateWithoutOriginalQuotaInput>
  }

  export type SignupUpdateWithWhereUniqueWithoutOriginalQuotaInput = {
    where: SignupWhereUniqueInput
    data: XOR<SignupUpdateWithoutOriginalQuotaInput, SignupUncheckedUpdateWithoutOriginalQuotaInput>
  }

  export type SignupUpdateManyWithWhereWithoutOriginalQuotaInput = {
    where: SignupScalarWhereInput
    data: XOR<SignupUpdateManyMutationInput, SignupUncheckedUpdateManyWithoutOriginalQuotaInput>
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionCreateManyEventInput = {
    id?: string
    question: string
    type?: $Enums.QuestionType
    sortId: number
    options?: QuestionCreateoptionsInput | string[]
    required?: boolean
    public?: boolean
  }

  export type QuotaCreateManyEventInput = {
    id?: string
    title: string
    size?: number | null
    sortId: number
  }

  export type RaffleSimulationCreateManyEventInput = {
    id?: string
    seed: string
    startTime: Date | string
    endTime: Date | string
    physicsState: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuestionUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    Answers?: AnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
    Answers?: AnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    sortId?: IntFieldUpdateOperationsInput | number
    options?: QuestionUpdateoptionsInput | string[]
    required?: BoolFieldUpdateOperationsInput | boolean
    public?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QuotaUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    Signups?: SignupUpdateManyWithoutQuotaNestedInput
    OriginalSignups?: SignupUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
    Signups?: SignupUncheckedUpdateManyWithoutQuotaNestedInput
    OriginalSignups?: SignupUncheckedUpdateManyWithoutOriginalQuotaNestedInput
  }

  export type QuotaUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    size?: NullableIntFieldUpdateOperationsInput | number | null
    sortId?: IntFieldUpdateOperationsInput | number
  }

  export type RaffleSimulationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleSimulationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleSimulationUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    seed?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    physicsState?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswerCreateManyQuestionInput = {
    id?: string
    answer: string
    signupId: string
  }

  export type AnswerUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    Signup?: SignupUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type AnswerUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    signupId?: StringFieldUpdateOperationsInput | string
  }

  export type AnswerUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    signupId?: StringFieldUpdateOperationsInput | string
  }

  export type AnswerCreateManySignupInput = {
    id?: string
    answer: string
    questionId: string
  }

  export type AnswerUpdateWithoutSignupInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    Question?: QuestionUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type AnswerUncheckedUpdateWithoutSignupInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
  }

  export type AnswerUncheckedUpdateManyWithoutSignupInput = {
    id?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
  }

  export type SignupCreateManyQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    originalQuotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
  }

  export type SignupCreateManyOriginalQuotaInput = {
    id?: string
    name: string
    email: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    quotaId: string
    registrationIntent?: Date | string | null
    status?: $Enums.SignupStatus
  }

  export type SignupUpdateWithoutQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    OriginalQuota?: QuotaUpdateOneRequiredWithoutOriginalSignupsNestedInput
    Answers?: AnswerUpdateManyWithoutSignupNestedInput
  }

  export type SignupUncheckedUpdateWithoutQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalQuotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Answers?: AnswerUncheckedUpdateManyWithoutSignupNestedInput
  }

  export type SignupUncheckedUpdateManyWithoutQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalQuotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
  }

  export type SignupUpdateWithoutOriginalQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Quota?: QuotaUpdateOneRequiredWithoutSignupsNestedInput
    Answers?: AnswerUpdateManyWithoutSignupNestedInput
  }

  export type SignupUncheckedUpdateWithoutOriginalQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
    Answers?: AnswerUncheckedUpdateManyWithoutSignupNestedInput
  }

  export type SignupUncheckedUpdateManyWithoutOriginalQuotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quotaId?: StringFieldUpdateOperationsInput | string
    registrationIntent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumSignupStatusFieldUpdateOperationsInput | $Enums.SignupStatus
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}