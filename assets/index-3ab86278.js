import{T as r}from"./index-8178a27c.js";const d=t=>{t.signals.pageAdded.once(i=>{const e=t.getPage(i),o=e.addBlock({flavour:"affine:page"}),a=e.addBlock({flavour:"affine:group"},o);for(let n=0;n<1e3;n++)e.addBlock({flavour:"affine:paragraph",text:new r(e,"Hello, world! "+n)},a)}),t.createPage("page0")},g=t=>{t.signals.pageAdded.once(i=>{const e=t.getPage(i),o=e.addBlock({flavour:"affine:page",title:"Welcome to BlockSuite playground"}),a=e.addBlock({flavour:"affine:group"},o);e.addBlock({flavour:"affine:paragraph",text:new r(e,"This playground is a demo environment built with BlockSuite.")},a),e.addBlock({flavour:"affine:paragraph",text:r.fromDelta(e,[{insert:"Try "},{insert:"typing",attributes:{bold:!0}},{insert:", "},{insert:"formatting",attributes:{italic:!0}},{insert:", and "},{insert:"dragging",attributes:{underline:!0,strike:!1}},{insert:" here!"}])},a),e.addBlock({flavour:"affine:paragraph",text:r.fromDelta(e,[{insert:"A quick tip 💡: Try removing the "},{insert:"?init",attributes:{code:!0}},{insert:" part in the URL and open it in another tab!"}])},a),e.resetHistory()}),t.createPage("page0")};export{g as basic,d as heavy};
