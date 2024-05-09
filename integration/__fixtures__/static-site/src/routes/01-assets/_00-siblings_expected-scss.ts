import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/routes/01-assets/00-siblings.scss");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"
const __vite__id = "__REPLACED_FOR_TESTS__/__fixtures__/static-site/src/routes/01-assets/00-siblings.scss"
const __vite__css = "body {\n  color: red;\n}\n/* __REPLACED_FOR_TESTS__ */"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))