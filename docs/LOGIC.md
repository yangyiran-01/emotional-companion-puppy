# 情绪与建议逻辑

这是对代码行为的说明，不是心理诊断或有效性研究。

## 请求和会话

每条消息由前端向 `/api/chat` 发送当前文本、最多 12 条近期消息、模式和会话建议选择。当前输入 1–1500 字符；上下文单条最多 2500 字符。前后端均使用 Zod 检查协议。聊天只保留在当前标签页内存；刷新、切换模式和新会话会清除。

## 情绪映射

`server/logic/emotion.ts` 对英文和中文关键短语进行规则匹配：

1. 先判断明确安全信号，进入 Concerned 和独立安全回应。
2. 规范少量否定表达，例如 not lonely、不觉得孤独；not happy 映射到负面线索。
3. 孤独、压力、疲惫、担忧等优先 Concerned，包括同一条消息里的混合情绪。
4. 近期压力之后的作业、截止日期和部分追问保持 Concerned。
5. 不确定、害怕尝试、缺乏信心 → Encouraging。
6. 开心、完成项目、好消息 → Happy。
7. 其他 → Calm。

返回 `emotionReason` 解释规则原因，不在控制台记录原始输入。宠物状态由 `useConversation` 控制，`Pet.tsx` 共用一套身体结构：Calm 呼吸眨眼、Happy 摇尾轻跳、Concerned 歪头与关切眉形、Encouraging 抬爪点头。减少动态效果偏好会关闭非必要动画。

## 建议门控与选择

`server/logic/social.ts` 仅在明确孤独、非常窄的孤独追问，或用户主动索要社交建议时生成卡片。普通作业压力和一般难过不触发。先显示情绪支持，再显示可选卡片。

会话选择为 available / offered / accepted / declined。offered、accepted 和 declined 都不会自动再次弹卡。Not now 与文字拒绝写入 declined；只有明确再次请求建议才可重新展示。Accept 展示一个可自行决定是否执行的小步骤；两个按钮都只改变本地状态，不发邮件、消息或外部联系请求。

## 安全与失败

明确自伤线索优先于普通聊天和建议。近期未解除的明确风险也保留安全路由。固定安全回应提供支持、即时危险时的当地急救或急诊途径、身边可信任的人；不捏造热线号码，不调用普通模型，也不发普通社交卡片。用户明确当前安全后解除窄范围上下文标记。规则无法全面识别危机，也可能误判引用、比喻或否定。

真实 AI 使用固定系统边界和简单输出规则检查，拒绝部分依赖语言与绕过社交卡片的建议。此检查不完善，可能漏判或误拦截；失败返回可重试错误，不用脚本冒充 AI。服务端 20 秒模型超时，前端 25 秒请求超时。失败保留用户消息，可 Retry 或 Edit；重试不重复添加用户气泡。

## 隐私边界

Demo 文本只经本地服务处理。AI 模式通过服务端把当前消息与近期上下文发送给 OpenAI。`store: false` 不等于供应商零保留；详见 README 的数据政策链接。应用没有聊天日志、数据库、浏览器持久存储或分析追踪。限流只维护短期 IP 计数。当前服务仅作为本地原型运行。

实现参考：[OpenAI Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)、[OpenAI 数据控制](https://developers.openai.com/api/docs/guides/your-data)；安全回应的基本急助方向参考 [NHS：Help for suicidal thoughts](https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/)。这些来源不构成本系统安全检测有效性的证明。
