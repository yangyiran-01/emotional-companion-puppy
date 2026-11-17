# GitHub 仓库与提交

公开仓库：[Emotional Companion Puppy](https://github.com/yangyiran-01/emotional-companion-puppy)。仓库由用户创建并提供链接；已核实可见性为 public、默认分支为 main。用户授权将本地代码放入该仓库。

本地 main 关联 origin。远程原有初始 README 提交保留在合并历史中，简介纳入完整 README；不强制覆盖远程历史。源码、分镜、开发与测试证据使用真实提交保存。

```sh
git clone https://github.com/yangyiran-01/emotional-companion-puppy.git
cd emotional-companion-puppy
npm ci
npm run dev
```

更新前后可用 `git log --oneline --decorate`、`git status` 及 `git rev-parse HEAD` 检查实际版本。首次评审快照使用 `demo-evidence-2026-11-17` 标签，最终作业提交版本和用户验收仍待确认。

提交检查包括 `npm run check`、README 字数与待提交内容检查。不要提交 `.env`、密钥、私人聊天、依赖、构建结果或工具临时文件。

README 顶部 Prose Word Count 由 `npm run readme:count` 生成，可用 `npm run readme:check` 核对。开发与测试记录中的未完成项保留到真实完成。选择项目许可证后才增加相应许可证文件；现有依赖保留各自许可证。

公开源码不等于应用已经托管上线；当前使用 README 中的 localhost 运行方式。推送完成应核对 GitHub 远程 main 与本地提交哈希一致。
