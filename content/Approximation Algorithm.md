# PTAS & FPTAS & APTAS

首先，好像 PTAS (Ploynomial-Time Approximation Scheme) 和 FPTAS (Fully Ploynomial-Time Approximation Scheme) 不再是一种问题的复杂性种类，而是一种近似算法的类别。这种算法可以让提供一个任意精度的近似比（这很难得，有些算法只能提供固定的近似比），但是可能出现的情况是，随着近似比的提高，算法运行得越来越慢，但是依然与输入的规模呈现多项式关系（这里我觉得很难啊，理论上可以无限近似，而复杂度依然是多项式时间）。

FPTAS 的性质要比 PTAS 更强，它不但保留了运行时间与输入规模的多项式关系，还与 $\frac{1}{\epsilon}$ 呈多项式关系，其中 $1 + \epsilon$ 是近似比。

APTAS (asymptotic polynomial-time approximation scheme) 的近似比是 $(1 + \epsilon) OPT + c$ 。也就是相比于 PTAS ，多引入了一个常数项 $c$ 。

# Misc

- [[ANNS]]
