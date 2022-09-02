# 六角學院 - React 讀書會 / TODO LIST APP

## Features

此專案藉由六角學院，所提供的 [Swagger API](https://todoo.5xcamp.us/api-docs/index.html) 文件及 [UI 設計稿](https://www.figma.com/file/pFivfS3rDX3N3u3dN9aIlx/TodoList?node-id=0%3A1) 實現一個具有**註冊**、**登入**、CRUD 待辦事項之簡易型 [TODO LIST APP](https://hsuifang.github.io/react-todo-app)。

學院在任務要求上須包含以下 12 項

- 必做：需使用 React 框架來挑戰，並整合此任務提供的 API
- 必做：需使用 React Router，並統一部署到 GitHub Pages
- 必做：代辦為零筆資料時，需顯示文字「目前尚無代辦事項」
- 必做：新增代辦功能
- 必做：移除代辦功能
- 必做：切換代辦狀態(打勾表示已完成、未勾表示待完成)
- 必做：狀態頁籤切換功能(全部、待完成、已完成)
- 必做：確認待完成項目總數 (5 個待完成項目)
- 必做：清除已完成項目
- 必做：登入、註冊 API 功能
- 必做：表單欄位為空值或非 Email 格式時，需提醒用戶。(例：alert 彈跳、紅色文字顯示、SweetAlert2)
- 必做：需處理重複帳號註冊時， API 回傳錯誤時，需提醒用戶。(例：alert 彈跳、紅色文字顯示、SweetAlert2)

## 頁面

### 待辦事項 (route: /#/)

- 需要註冊過才能使用
- 可新增、編輯、刪除、查看用戶的待辦項目
- 切換頁籤查看待辦狀態
- 沒有身份，會直接轉導至登入頁面(/login)

### 登入 (route: /#/login)

### 註冊 (route: /#/sign-in)

- 檢核輸入框機制

## 系統說明

在專案裡可使用以下 Script ：

### `npm start`

在 development 環境下執行 Runs the app in the development mode.\Open [http://localhost:9876](http://localhost:9876) to view it in your browser.

### `npm test`

執行測試腳本

### `npm build`

由於要部署於 Github 之原因，故將檔案包版至/build/react-todo-app

### `npm deploy`

部署至 package.json homepage 所述 [react-todo-page](https://hsuifang.github.io/react-todo-app)

## 參考與學習資源

[六角學院 API 文件](https://todoo.5xcamp.us/api-docs/index.html)
[六角學院 UI 設計稿](https://www.figma.com/file/pFivfS3rDX3N3u3dN9aIlx/TodoList?node-id=0%3A1)
[Test Library](https://testing-library.com/)
