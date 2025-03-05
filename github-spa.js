(function () {

  /**
   * hack github 404页面自动模拟spa功能
   * 
   * 参考：https://github.com/rafgraph/spa-github-pages
   * 
   * 实现思路
   * 1. 提取basepath后的内容，作为query path=xxx重定向到主地址（注意url编码）
   * 2. 首页解析这个query，react router 直接replace history
   */
  function redirect() {
    const origin = window.location.origin
    const basePath = 'web3-swap-demo'

    // 判断是否是github pages
    const isGithubPages = origin.includes('github.io')
    if (!isGithubPages) {
      return
    }

    const pathname = window.location.pathname
    const search = window.location.search
    const searchParams = new URLSearchParams(search)

    // 这个变量被占用了，如果有，报错
    if (searchParams.has('path')) {
      console.error('path already exists')
      return
    }

    const queryPath = pathname.replace(`/${basePath}`, '')
    // 处理空路径，避免编码空字符串
    const pathToEncode = queryPath || '/'
    const encodedPath = encodeURIComponent(pathToEncode)
    searchParams.append('path', encodedPath)
    const newSearch = searchParams.toString()

    const redirectUrl = `${origin}/${basePath}?${newSearch}`

    // NOTE: 使用 replace 代替 href=xxx，因为 href会多一个记录
    window.location.replace(redirectUrl)
  }

  redirect()

})()
