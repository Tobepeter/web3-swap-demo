
(function () {
  const pathname = window.location.pathname
  if (pathname.startsWith('/github-spa')) {
    window.location.href = pathname.replace('/github-spa', '')
  }
})()
