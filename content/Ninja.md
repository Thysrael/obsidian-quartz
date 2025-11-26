# 总述

Ninja 是由 [[Google]] 开发用于构建 Chrome 的构建体系。他有如下特点：

- 构建速度快：Chrome 太大了，必须使用增量构建
- 适用于单体仓库（monorepo）：也就是并没有第三方依赖，自包含的，封闭的项目

# GN

GN 的全称是“Generate Ninja”，它才是对标 cmake 的东西，它会读取 `.gn` 结尾的文件（对标 `CMakeLists.txt`），生成 `build.ninja` 。有如下 CLI 命令：

```shell
gn gen <build_directory>
gn clean <build_directory>
```

在语法方面，cmake 的语法偏向过程式，基本的单位是 `command`，可以在构建脚本中实现复杂精妙的逻辑；而 gn 的语法偏向声明式，其基本格式如下：

```gn
target_type("target_name") {
 ... 
}
```

如：

```gn
ohos_executable("ipc_server_test") {
  sources = [ "./src/main_server.cpp" ]

  configs = [
    "$SUBSYSTEM_DIR/config:ipc_util_config",
    "$IPC_TEST_ROOT:ipc_test_config",
  ]

  deps = [ ":ipc_test_helper" ]

  external_deps = [
    "access_token:libnativetoken_shared",
    "access_token:libtokensetproc_shared",
    "c_utils:utils",
    "hilog:libhilog",
    "ipc:ipc_core",
    "samgr:samgr_proxy",
  ]

  part_name = "ipc"
  subsystem_name = "communication"
}
```

gn 功能相对受限。它不鼓励在构建脚本中编写复杂的逻辑。

# Ninja

CLI 命令如下所示：

```shell
ninja -C <build_directory> [target...]
```