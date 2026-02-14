import sys
import os
import asyncio

# Ensure project root is in path
# Current file: .../JustSearch/tools/manual_login.py
# Root: .../JustSearch
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

# Now we can import backend
try:
    from backend.app.browser_manager import init_global_browser, shutdown_global_browser
except ImportError as e:
    print(f"导入错误: {e}")
    print(f"尝试添加的路径: {project_root}")
    print("请确保你在项目根目录下运行此脚本，或者正确设置了 PYTHONPATH。")
    sys.exit(1)

async def main():
    print("\n[JustSearch] 正在启动浏览器登录助手...")
    print(f"项目根目录: {project_root}")
    
    # 强制非 Headless 模式启动
    await init_global_browser(headless_override=False)
    
    # 获取全局上下文
    from backend.app.browser_manager import _GLOBAL_CONTEXT
    
    if _GLOBAL_CONTEXT:
        print("\n" + "="*60)
        print(">>> 浏览器已启动！")
        print(">>> 请在打开的 Chrome 窗口中：")
        print("    1. 访问 https://google.com")
        print("    2. 点击右上角登录并完成 Google 账号登录")
        print("    3. (可选) 访问一些常用网站以增加 Cookies 信任度")
        print("\n>>> 完成后，请在此终端按回车键以保存状态并退出。")
        print("="*60 + "\n")
        
        # 打开一个新标签页并跳转到 Google
        page = await _GLOBAL_CONTEXT.new_page()
        try:
            await page.goto("https://www.google.com")
        except Exception as e:
            print(f"自动打开 Google 失败: {e}，请手动输入网址。")

        # 阻塞等待用户确认
        await asyncio.to_thread(input, "按回车键结束程序...")
        
        print("正在关闭浏览器并保存数据...")
        await shutdown_global_browser()
        print("完成！现在您可以重新运行项目，应该不会再频繁出现验证码了。")
    else:
        print("错误：无法启动浏览器，请检查日志。")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n程序已取消。")