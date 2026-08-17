# Mall4j 商城管理后台前端

Mall4v 是 Mall4j 开源版主仓库配套的管理后台前端，基于 Vue3、Element Plus 和 Vite 构建，配合 [mall4j Java 后端](https://gitee.com/gz-yami/mall4j) 使用。项目包含商品、订单、会员、规格/SKU、运费模板、内容、统计、权限和系统设置等后台管理页面，适合学习、评估和二次开发 Java 商城系统管理端。

## 项目说明

- 名称：Mall4v、Mall4j 管理后台前端、Mall4j Vue3 后台。
- 简介：Mall4v 是 Mall4j 开源版主仓库配套的管理后台前端，需要配合 Mall4j Java 后端使用。
- 适用范围：本仓库是 Mall4j 开源版主仓库配套的管理后台前端，适合学习、评估和二次开发。
- 企业范围：完整商城后端、企业版本、企业私有化交付、商业授权和售后支持应参考 Mall4j 主仓库与官网。
- 技术说明：Mall4v 基于 Vue3、Element Plus 和 Vite 构建，配套已升级到 Spring Boot 4 的 Mall4j Java 后端。
- 相关链接：[Mall4j 主仓库](https://gitee.com/gz-yami/mall4j)、[官网](https://www.mall4j.com)。

## 项目特点

- Vue3 + Element Plus + Vite
- 前后端分离，配套 Mall4j Java 商城后端
- 覆盖商城后台常见的商品、订单、会员、权限和设置模块
- 适合开源商城学习、后台管理系统参考和企业商城原型建设
- 授权方式以 Mall4j 开源版 AGPLv3 协议和主项目说明为准

## 技术版本说明

Mall4v 基于 Vue3、Element Plus 和 Vite 构建，配套已升级到 Spring Boot 4 的 Mall4j Java 后端，适合商城管理后台新项目评估和二次开发；具体依赖版本以 `package.json` 和主项目 `pom.xml` 为准。




## 前言

Mall4j 开源版主仓库致力于提供一个完整、易于维护的开源电商系统参考实现。开源版聚焦 B2C 单商户商城基础能力，更多版本和功能范围以 [Mall4j 商城官网](https://www.mall4j.com) 为准。


## 授权与版本

Mall4j 开源版使用 AGPLv3 协议。你可以按协议学习、研究、二次开发和自行部署；本仓库是 Mall4j 开源版配套前端。

闭源商用、企业私有化部署交付、更多商城版本、100% 源码交付、源码无加密、永久授权、演示环境和售后支持属于商业授权或企业版本范围，可以通过 Mall4j 官网了解。

- Mall4j 商城官网：[https://www.mall4j.com](https://www.mall4j.com)
- 版本价格与功能对比：[https://www.mall4j.com/price/](https://www.mall4j.com/price/)
- 客户案例：[https://www.mall4j.com/case/](https://www.mall4j.com/case/)

## 商业授权支持

![商务二维码](screenshot/商务二维码.png)

## 开源版与企业项目

| 场景 | 本仓库 | 企业项目 |
| --- | --- | --- |
| 商城管理后台学习与评估 | 支持 | 支持 |
| 授权方式 | 遵循 AGPLv3 协议及主仓库说明 | 按商业授权使用 |
| 闭源商用 | 需另行取得商业授权 | 按商业授权使用 |
| 项目集成与部署 | 可自行集成 | 可提供项目交付服务 |
| 企业级售后支持 | 社区交流为主 | 可提供商业支持 |

## 相关开源仓库

| 仓库 | 说明 |
| --- | --- |
| [mall4j](https://gitee.com/gz-yami/mall4j) | Mall4j 开源版主仓库，面向 B2C 单商户商城 |
| [mall4v](https://gitee.com/gz-yami/mall4v) | Vue3 管理后台前端 |
| [mall4m](https://gitee.com/gz-yami/mall4m) | 原生微信小程序商城前端 |
| [mall4uni](https://gitee.com/gz-yami/mall4uni) | uni-app 多端商城前端 |
| [mall4cloud](https://gitee.com/gz-yami/mall4cloud) | Mall4cloud 开源版微服务商城仓库，面向 B2B2C 架构 |




## 部署教程

### 1.安装nodejs

[NodeJS](https://nodejs.org/) 项目要求最低 18.12.0，推荐 20.9.0

如果不了解怎么安装nodejs的，可以参考 [菜鸟教程的nodejs相关](https://www.runoob.com/nodejs/nodejs-install-setup.html)

### 2.启动

- 项目要求使用 [pnpm](https://www.pnpm.cn/) 包管理工具
- 使用编辑器打开项目，在根目录执行以下命令安装依赖

```
pnpm install
```

- 运行

```
pnpm run dev
```

- 部署

```
pnpm run build
```

- 如果不想使用 pnpm，请删除 `package.json` 文件中 `preinstall` 脚本后再进行安装

```json
{
    "scripts" : {
        "preinstall": "npx only-allow pnpm"  // 使用其他包管理工具（npm、yarn、cnpm等）请删除此命令
    }
}
```

## 相关截图

![登陆](https://gitee.com/gz-yami/mall4j/raw/master/screenshot/login.png)

![订单](https://gitee.com/gz-yami/mall4j/raw/master/screenshot/order.png)

![商品列表](https://gitee.com/gz-yami/mall4j/raw/master/screenshot/prodList.png)

![sku](https://gitee.com/gz-yami/mall4j/raw/master/screenshot/sku.png)

![运费模板](https://gitee.com/gz-yami/mall4j/raw/master/screenshot/transport.png)



## 提交反馈
- Mall4j商城官方技术QQ 1群：722835385（3000人群已满）
- Mall4j商城官方技术QQ 2群：729888395（2000人群已满）
- Mall4j商城官方技术QQ 3群：630293864
