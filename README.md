借鉴[WebStack-vue](https://github.com/Anjaxs/WebStack-vue)
# webstack

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## vue2+supabase 实现网址导航，不需要服务器也能做支持管理的的导航网站，可在管理台添加更新导航数据
## 前端使用vue2+element-ui+supabase实现
## 可以将其部署到github page 或者vercel
## 本项目使用github page，每次push后自动更新

## [demo](https://aa1049372051.github.io/webstack-vue-supabase/)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/c3dd89d9-a566-479d-b9af-1946f40a7840)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/7ef8303e-629f-4af4-8058-c1c93e100e31)


## 第一步
去[supabase](https://supabase.com/)官网注册账号，可以使用github账号登录，然后新建项目，复制项目url和service_role(不是anon,本来操作表anon是可以的，但是anon不能操作仓库)替换src/config.js中的

![QQ截图20240508173702](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/0bda2eb9-cdee-4c17-b033-415ddd9e80b4)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/cf22f86a-1a39-4dca-babf-e60b77df48d7)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/fdb7ff02-e127-4203-b1bb-65b5104691c9)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/006471b6-eac3-4ab1-9196-aa9b72c90991)


## 第二步

复制sql/webstack-vue.sql中的内容到supabase完成表的创建

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/aeeea387-ee6b-44f3-baf6-7b88d9c1a5f4)

后台管理台默认用户名:admin,密码:123456


## 第三步
新建存储仓库用于保存网站logo,公共的，仓库名默认 webstack-vue ，可以在config.js中修改;

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/17aca304-e5eb-4b96-a182-263339c4f80b)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/78691111-0e02-4d69-8694-c8c7267ec366)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/cb706ad4-74dc-40c7-a6ae-7006b41653cd)

修改完成后yarn build就能得到编译好的代码，在dist目录，可以放在自己的服务器，也可以放在github page或vercel里面


## 第四步

大家可以fork我的项目,我写了脚本，每次push到主版本后github actions会自动编译并把编译好的内容提交的github pages中，大家可以去设置中找到page访问地址。
![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/07be6ac3-1f39-4b22-8a21-a39fa0bc1b58)


github actions脚本里面定义了一个变量PERSONAL_ACCESS_TOKEN，是github token，用于有权限将编译好的内容提交到分支中

github token设置方法，点击右上角图像=>settings=>打开的新页面=》Developer Settings=》Fine-grained  tokens=》Generate new token
或者直接访问token设置地址 [tokens](https://github.com/settings/tokens)
![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/504ec574-6f4f-4bcd-a2bc-827ccf2ba36c)

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/8bca4526-1021-4db1-94f6-60c80441ea10)

填写token名称，选择有效期(token过期后自动更新脚本就会失效)；仓库随便你选，但至少要包含你fork的仓库，权限这里都给可读可写最好，我没有一个个试，只要你不把token给别人就没问题，最后点生成
页面会生成一个token给你；复制
![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/5ef37be9-1a38-4887-9588-7256547afa8c)

设置Actions secrets and variables
新建名为 PERSONAL_ACCESS_TOKE 的变量，值就是上一步新建的token
![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/7f098633-43b2-4524-b0b0-307e0c560007)

如果你担心第一步supabase的url和key直接写在代码中不安全，也可以再新建两个变量
SUPABASE_URL 和 SUPABASE_KEY

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/549a7097-32d2-49cc-a35e-50bfe3725e5c)

一切完成后每次push到主版本就会自动更新了


## 第五步
在管理台=》我的里面还添加了添加测试数据的功能；数据来源是src/assets/data.json;
分类表的icon就是从data.json中取的，网站的logo也有;
大家可以直接修改data.json文件然后在管理台初始化数据

![image](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/7cdbbe8a-0a02-4bc5-8f8d-bf49ad7a6121)



