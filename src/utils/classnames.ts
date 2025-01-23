/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";

// Utility for if-elseif-else conditions
class ConditionalClassnames {
  private ifRule: { condition: any; args: any[] };
  private elifRules: Array<{ condition: any[]; args: any[] }>;
  private elseRule?: { args: any[] };

  constructor(condition: any, ...args: any[]) {
    this.ifRule = { condition, args };
    this.elifRules = [];
    this.elseRule = undefined;
  }

  elseIf(condition: any) {
    return (...args: any[]) => {
      this.elifRules.push({ condition, args });
      return this;
    };
  }

  else(...args: any[]) {
    this.elseRule = { args };
    return this.toString();
  }

  toString() {
    if (this.ifRule.condition) return classNames(this.ifRule.args);
    for (const elifRule of this.elifRules) {
      if (elifRule.condition) return classNames(elifRule.args);
    }
    if (this.elseRule) return classNames(this.elseRule.args);
    return "";
  }
}

// Utility for variants with default properties
class VariantClassnames<V extends PropertyKey> {
  private variant: V;
  private variantArgs: Partial<Record<V, any | any[]>>;
  private defaultArgs: any[];

  constructor(variant: V, variantArgs: Partial<Record<V, any[]>>) {
    this.variant = variant;
    this.variantArgs = variantArgs;
    this.defaultArgs = [];
  }

  default(...args: any[]) {
    this.defaultArgs = args;
    return this.toString();
  }

  toString() {
    return classNames(this.variantArgs[this.variant] ?? this.defaultArgs);
  }
}

// Utility interface for typing additional properties to a function.
interface C {
  (...args: any[]): string;
  create: (...args: any[]) => (...args: any[]) => string;
  variant<V extends PropertyKey>(
    v: V
  ): (variantArgs: VariantClassnames<V>["variantArgs"]) => VariantClassnames<V>;
  if: (arg: any) => (...args: any[]) => ConditionalClassnames;
}

/**
 * c() is an utility function as an extension of classNames (from the
 * package of the same name). It allows you to use the full classnames API
 * using the `c()` function.
 *
 * It also adds the following functionality:
 *
 * Conditional logic with `c.if()`, `.elseIf()` and `.else()`.
 * ```
 * className={c(
 * 	"classes",
 * 	c.if(a > 0)("class-a")
 * 		.elseIf(a < 0)("class-b")
 * 		.else("class-c")
 * )}
 * ```
 *
 * Typesafe variants with autocomplete with `c.variant()`
 * ```
 * className={c(
 * 	"classes",
 * 	c.variant(color)({
 * 		dark: "dark-class",
 * 		light: "light-class",
 * 		blue: "blue-class",
 * 		red: "red-class",
 * 	})
 * )}
 * ```
 *
 * Base styles with `c.create()`
 * ```
 * const utility = c.create("class-1");
 * utility("class-2") // Results in "class-1 class-2"
 * ```
 */
export const c = <C>function (...args: any[]) {
  return classNames(...args);
};

// Attach the create function
c.create = (...args1: any[]) =>
  function (...args2: any[]) {
    return classNames(...args1, ...args2);
  };

// Attach the variant function
c.variant = <V extends PropertyKey>(v: V) => {
  return (variantArgs: VariantClassnames<V>["variantArgs"]) =>
    new VariantClassnames(v, variantArgs);
};

// Attach the if function
c.if = (condition: any) => {
  return (...args: any[]) => new ConditionalClassnames(condition, ...args);
};
