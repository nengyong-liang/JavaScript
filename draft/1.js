const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const { format } = require("date-fns");

// 获取北京时间
const now = new Date();
const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
const version = `0.${format(beijingTime, "yyyyMMddHHmmss")}`;

//git diff HEAD
const output = execSync("git diff HEAD", { encoding: "utf-8" });
console.log("git diff HEAD:",output);

const modifiedFiles = output.split("\n").filter(f => f.endsWith(".js"));

//打印modifiedFiles 
console.log("modifiedFiles:", modifiedFiles);

if (modifiedFiles.length === 0) {
  console.log("✅ 没有需要更新版本号的 JS 文件。");
  process.exit(0);
}

let updatedFiles = [];

// 遍历修改过的文件，读取内容并替换 @version 行
for (const file of modifiedFiles) { 
  //打印文件名
  console.log(`正在处理文件: ${file}`);
  const filePath = path.resolve(__dirname, file); // 获取文件的绝对路径
  //检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ 跳过不存在的文件: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, "utf-8");
  const newContent = content.replace(/\/\/ @version\s+.*/, `// @version     0.20250503124723

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    updatedFiles.push(file);
    console.log(`✅ 更新版本号: ${file}`);
  } else {
    console.log(`ℹ️ 文件中未发现 @version 行: ${file}`);
  }
}

if (updatedFiles.length === 0) {
  console.log("📭 没有文件需要更新版本号");
  process.exit(0);
}

// 输出文件路径供后续 git add 使用
const files = updatedFiles.map(f => `"${f}"`).join(" ");
fs.appendFileSync(process.env.GITHUB_ENV, `UPDATED_FILES=${files}\n`);
fs.appendFileSync(process.env.GITHUB_ENV, `NEW_VERSION=${version}\n`);


