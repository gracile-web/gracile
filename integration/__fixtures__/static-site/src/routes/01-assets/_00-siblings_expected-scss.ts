import { createHotContext as __vite__createHotContext } from "__REPLACED_FOR_TESTS__/routes/01-assets/00-siblings.scss");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"
const __vite__id = "__REPLACED_FOR_TESTS__/routes/01-assets/00-siblings.scss"
const __vite__css = "body {\n  color: red;\n}"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))