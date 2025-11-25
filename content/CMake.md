# CLI

作为一个跨平台的构建工具， `cmake` 的执行分成了两个阶段：

- 根据 `CMakeLists.txt` 生成平台特定的构建脚本，比如在 [[Linux]] 上生成 [[Make]] 或者 [[Ninja]]
- 运行生成的构建脚本完成构建

这也就导致，`cmake` 有两种使用方式：

## 生成构建脚本

``` shell
# 指定 CMakeLists.txt 的位置和构建脚本的生成位置
cmake [options] -S <source_directory> -B <build_directory>
```

此外还附加一些 options：

- `-D<var>:<type>=<value>`： 设置 CMake 变量
- `-G <generator-name>`：设置具体的构建器，比如 Ninja

## 执行构建脚本

```shell
cmake --build <build_directory> [options]
```

常用的 options 有：

- `--target <name>`：构建特定目标，类似于 `make target`
- `-j [<jobs>]`：构建的并行度，类似于 `make -j8`
- `--clean-first`: 在构建之前先执行清理操作。

此外构建完之后，可能还有安装流程，命令如下：

```shell
cmake --install <build_directory> [options]
```

# Grammer

## Command

所有 CMake 代码都由命令构成。一个命令的基本结构是：

```cmake
command_name(argument1 argument2 ...)
```

- `command_name` 是大小写不敏感的：`project()` 和 `PROJECT()` 效果完全一样。但约定俗成使用**小写**。
- `argument` 是大小写敏感的：`MyProject` 和 `myproject` 是不同的。这尤其在处理文件名和变量名时很重要。

## Variable

设置变量：

```cmake
# 设置一个普通变量
set(PROJECT_VERSION "1.0.0")

# 设置一个包含多个值的变量（本质上是一个分号分隔的字符串，称为 "list"）
set(SOURCES main.cpp utils.cpp logger.cpp)
```

使用变量：

```cmake
# 使用上面设置的变量
project(MyApp VERSION ${PROJECT_VERSION})
add_executable(my_app ${SOURCES})

# 环境变量
message("System Path is: $ENV{PATH}")
```

## Control Flow

条件：

```cmake
if(CONDITION)
  # do something
elseif(OTHER_CONDITION)
  # do something else
else()
  # do something as a fallback
endif()
```

循环：

```cmake
set(MY_SOURCES a.cpp b.cpp c.cpp)

foreach(SOURCE_FILE IN LISTS MY_SOURCES)
  # message() 命令会打印信息到终端
  message("Found source file: ${SOURCE_FILE}")
endforeach()
```

## Function

```cmake
# 定义一个函数，用于为目标设置通用的编译器警告
function(set_common_warnings TARGET_NAME)
  target_compile_options(${TARGET_NAME} PRIVATE
      -Wall
      -Wextra
      -Wpedantic
  )
endfunction()

# 调用函数
add_executable(app1 main1.cpp)
set_common_warnings(app1) # 为 app1 添加警告

add_library(lib1 lib1.cpp)
set_common_warnings(lib1) # 为 lib1 添加警告
```
# Target

## Overview

为了让项目的构建变得井然有序，cmake 抽象出了 `target` 这个概念来描述构建。

每个 `target` 都是一个构建单元，比如说可执行文件， object 文件，库文件，都可以视为一个 `target` 。当然，一些抽象的东西，比如一个 `echo` 命令，或者头文件，也可以视为一个 `target` 。

一些 target，是需要其他一些 target 的。比如说一个可执行文件，依赖于一个库文件。可执行文件是一个 target，库文件同样是一个 target。cmake 就是靠着这种 target 之间的联系，组织起了一个复杂的构建系统。

其实这个概念在 GNU Make 中也有体现，只不过没有 cmake 演化得这么全面。BTW，这个东西在 [[Scons]] 中被叫作 `Node` 。

## Types

target 根据创建的形式不同，有不同的类型。

**我们自己写的可执行文件：**

```cmake
add_executable(my_app main.cpp math.cpp)
```

**我们自己写的库文件：**

```cmake
# 静态库
add_library(math_lib STATIC math.cpp)
# 动态库
add_library(math_lib SHARED math.cpp)

# 公开 API 的头文件，方便库的调用者使用
target_include_directories(math_lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
```

还有一种特殊的库文件，它只有头文件，并没有对应的库实现，这种存在主要是在开发上，传递“接口”：

```cmake
add_library(my_header_lib INTERFACE)
# 告诉 CMake，任何链接了 my_header_lib 的 Target， 
# 都需要自动添加这个头文件搜索路径。 

target_include_directories(my_header_lib
	INTERFACE
	${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

**自定义的命令：**

```cmake
# 创建一个名为 "docs" 的 Target，当构建它时，会执行 Doxygen 命令
add_custom_target(docs
    COMMAND doxygen ${CMAKE_CURRENT_SOURCE_DIR}/Doxyfile
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMENT "Generating API documentation with Doxygen"
)
```

**第三方的库文件：**

如果这个第三方库文件已经在系统中安装了：

```cmake
# 查找 Boost 库，要求版本至少为 1.71，并且需要 filesystem 和 system 这两个组件
# REQUIRED 关键字表示如果找不到，CMake 将会报错并停止 
find_package(Boost 1.71 REQUIRED COMPONENTS filesystem system)
```

这同样会创建一个名为 `Boost` 的 target，我们可以这样使用：

```cmake
target_link_libraries(my_app PRIVATE Boost::filesystem Boost::system)
```

如果第三方库需要从网络上下载，或者指定特定的版本：

```cmake
# include 是一个 cmake 命令，表示启动 cmake 的 FetchContent 功能
include(FetchContent) 
FetchContent_Declare( 
	fmt # 给这个依赖起个名字 
	GIT_REPOSITORY https://github.com/fmtlib/fmt.git 
	GIT_TAG 10.2.1 # 指定一个确切的版本 
)
# 下载
FetchContent_MakeAvailable(fmt)
```

看到最后我们会疑惑，我们的 `.o` 文件呢？为什么没有一个专门的 target 用于生成 Object 文件。仔细思考一下就会发现，Object 文件只是从“编译-链接”角度才会产生的概念，而从“构建”的角度去看，只会包括最终可以运行的“可执行文件”和辅助可执行文件的“库文件”。实际上，在我们执行如下命令的时候：

```cmake
add_executable(my_app main.cpp math.cpp)
```

就包含了生成 `main.o` 和 `math.o` 并最终被链接成 `my_app` 的逻辑了。

## Properties

`target` 具有一系列属性，比如说：

- 它由哪些**源文件**编译而来？`add_executable(target ...), add_library(target ...)`
- 它需要包含哪些**头文件目录**？ `target_include_directories(target ...)`
- 它需要链接哪些**其他的库**？ `target_link_libraries(target ...)`
- 它需要哪些**编译选项**？ `target_compile_options(target ...)`
- 它需要哪些**预处理宏定义**？ `target_compile_definitions(target ...)`

target 的属性有 3 种类型，这些类型决定了它们自己的属性，是否要“传播给”依赖于他们的 target：

- `PRIVATE`：属性仅应用于当前 Target，不会传递给任何依赖它的消费者
- `PUBLIC`：属性既应用于当前 Target，也会传递给依赖它的消费者。
- `INTERFACE`：属性仅传递给消费者，不应用于当前 Target 本身。