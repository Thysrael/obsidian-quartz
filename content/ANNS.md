ANNS（Approximate Nearest Neighbor Search，近似最近邻搜索）是一类用于高效查找近似最近邻的算法，主要解决高维数据下精确搜索（如暴力搜索）计算量过大的问题。

ANNS 是一个需求，具有有多种近似方法。

# Cluster

通过聚类将数据分组，搜索时仅计算目标点与少数聚类中心的距离，大幅减少计算量。

IVF（Inverted File Index）有两个阶段：

- 聚类：
  - 用 K-Means 将所有数据点聚类成 `nlist` 个簇
  - 每个点被分配到最近的簇，并建立倒排列表（记录每个簇包含的数据点ID）。
- 搜索：
  - 计算查询向量与所有聚类中心的距离，选出最近的 `nprobe` 个簇（ `nprobe << nlist` ）
  - 仅在这 `nprobe` 个簇内进行精确搜索（如暴力计算距离）。

# Tree

通过树形结构分割数据空间，减少搜索范围。

如 KD-Tree 或者 Ball-Tree 。构建 $O(N log N)$，搜索 $O(log N)$（低维时）。

# Hash

LSH(Locality-Sensitive Hashing) 通过哈希函数将相似数据映射到相同或相近的桶中。

内存友好，适合海量数据，但精度较低。

# Graph

构建近邻图，通过图的遍历快速找到近似最近邻。

HNSW（Hierarchical Navigable Small World）是当前最优算法之一，支持高召回率与低延迟。

搜索\$O(log N)\$，内存占用较高。
