# GitHub 提交准备

本地 Git 仓库分支为 main。源码、README、分镜、开发与测试证据准备保存为真实评审快照；用 `git log --oneline --decorate` 查看实际提交，不把计划写成已发布记录。当前没有远程仓库或公开发布记录。

当前仓库英文名称为 **Emotional Companion Puppy**（情绪陪伴小狗），GitHub 目标名称使用 `emotional-companion-puppy`；应用品牌为 PawPal。可用 GitHub 连接确认后，按实际账户创建公开仓库并配置真实远程地址。提交前执行 `npm run check`，检查待提交内容，确认没有 `.env`、密钥、私人聊天或工具临时文件。不要把 node_modules、dist 或 `.artifacts` 加入提交。

README 顶部 Prose Word Count 由 `npm run readme:count` 生成，可用 `npm run readme:check` 核对。开发与测试记录中的未完成项保留到真实完成。选择项目许可证后才增加相应许可证文件；现有依赖保留各自许可证。

公开仓库准备不等于应用托管上线；当前只支持经验证的 localhost 运行方式。GitHub 远程创建与发布将在后续交付中如实记录。
