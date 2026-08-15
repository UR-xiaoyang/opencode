const mod = window.opencodeHost.forScript()

const translations = new Map([
  ["File", "文件"],
  ["Edit", "编辑"],
  ["View", "视图"],
  ["Go", "转到"],
  ["Window", "窗口"],
  ["Help", "帮助"],
  ["New Session", "新建会话"],
  ["Open Project...", "打开项目..."],
  ["Settings", "设置"],
  ["New Window", "新建窗口"],
  ["Close Window", "关闭窗口"],
  ["Undo", "撤销"],
  ["Redo", "重做"],
  ["Cut", "剪切"],
  ["Copy", "复制"],
  ["Paste", "粘贴"],
  ["Delete", "删除"],
  ["Select All", "全选"],
  ["Toggle Sidebar", "切换侧边栏"],
  ["Toggle Terminal", "切换终端"],
  ["Toggle File Tree", "切换文件树"],
  ["Reload", "重新加载"],
  ["Toggle Developer Tools", "切换开发者工具"],
  ["Actual Size", "实际大小"],
  ["Zoom In", "放大"],
  ["Zoom Out", "缩小"],
  ["Toggle Full Screen", "切换全屏"],
  ["Back", "返回"],
  ["Forward", "前进"],
  ["Previous Session", "上一个会话"],
  ["Next Session", "下一个会话"],
  ["Previous Project", "上一个项目"],
  ["Next Project", "下一个项目"],
  ["Minimize", "最小化"],
  ["Maximize", "最大化"],
  ["OpenCode Documentation", "OpenCode 文档"],
  ["Support Forum", "支持论坛"],
  ["Export Logs...", "导出日志..."],
  ["Share Feedback", "提交反馈"],
  ["Report a Bug", "报告问题"],
])

mod.ui.observe(
  ".desktop-app-menu [data-slot='dropdown-menu-item-label'], .desktop-app-menu-heading",
  (element) => {
    const translation = translations.get(element.textContent?.trim() ?? "")
    if (translation) element.textContent = translation
  },
)
