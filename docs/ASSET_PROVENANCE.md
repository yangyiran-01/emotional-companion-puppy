# 角色与资源来源

- Figma 原始 Calm 小狗：Figma `generate_vector_illustration`，使用 Figma AI credits，2026-11-17；奶油毛、垂耳、圆脸、短尾、薰衣草围巾。四状态由同一矢量源修改眉眼、嘴和爪子，详见设计阶段审查记录。
- Web 角色：`src/components/Pet.tsx`，Codex 辅助编写的 SVG 几何重建。Figma 导出因 MCP Starter 限额受阻，因此不是未经核实的原始导出。所有状态共享身体、颜色、耳朵和围巾，只变化表情和动作。没有抓取网络犬类图片，没有额外生成四张随机宠物。
- 已执行的 AI 辅助检查：浏览器观察 Calm、Happy、Concerned 和 Encouraging，检查奶油体色、垂耳、围巾及体型保持一致。调整了移动端尺寸和状态动画。没有声称用户已人工验收，最终可爱程度和设计一致性待你判断。
- 网站 favicon `public/paw.svg` 为代码绘制的爪印；功能图标来自 Lucide；Inter 从 npm 本地打包，不请求 Google Fonts。依赖许可见根目录第三方说明。
- 本项目没有使用 ImageGen 生成栅格角色资源。Figma 原始生成和后续 AI 辅助编辑如实记录；没有虚构人工画师或人工调整历史。
- 作业分镜：`scripts/build-storyboards.tsx` 复用应用的 `Pet.tsx`，结合代码回放的 Demo 对话，生成三个 SVG 和 HTML 查看页。它们是带清晰标签的合成示例插图，不是浏览器截图或真实参与者记录。三张 SVG 已完整渲染并进行 AI 辅助视觉检查，用户最终审查待进行。
