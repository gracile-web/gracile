import type { TitleElement, MyComponentUpdateEvent, MyComponentInputEvent, TodoMvc, Lab } from "./elements.d.ts";

type BaseEvents = {};

type TitleElementProps = {
  /** Some stuff */
  someObject?: TitleElement["someObject"];
  "attr:someObject"?: TitleElement["someObject"];
  /** Some stuff Prop 2 */
  someprop?: TitleElement["someProp"];
  "attr:someprop"?: TitleElement["someProp"];
  /**  */
  hey?: TitleElement["hey"];
  "attr:hey"?: TitleElement["hey"];
  /** Some stuff */
  "prop:someObject"?: TitleElement["someObject"];
  /** Some stuff Prop 2 */
  "prop:someProp"?: TitleElement["someProp"];
  /**  */
  "prop:hey"?: TitleElement["hey"];
  /** emitted when updated */
  "on:update"?: JSX.EventHandler<TitleElement, MyComponentUpdateEvent>;
  /** emitted when inputaaaaa */
  "on:input"?: JSX.EventHandler<TitleElement, MyComponentInputEvent>;
};

type TodoMvcProps = {
  /**  */
  "prop:store"?: TodoMvc["store"];
};

type LabProps = {};

export type CustomElements = {
  /**
   * Hello
   *
   * ---
   *
   *
   * ### **Events:**
   *  - **update** - emitted when updated
   * - **input** - emitted when inputaaaaa
   *
   * ### **Slots:**
   *  - **Test** - the slot to use
   */
  "title-element": Partial<TitleElementProps & BaseEvents & JSX.HTMLAttributes<TitleElement>>;

  /**
   *
   *
   * ---
   *
   */
  "todo-mvc": Partial<TodoMvcProps & BaseEvents & JSX.HTMLAttributes<TodoMvc>>;

  /**
   *
   *
   * ---
   *
   */
  "lab-1": Partial<LabProps & BaseEvents & JSX.HTMLAttributes<Lab>>;
};
