export const showWhitelist = (submittedRequest: boolean) => {
  return { type: 'SHOW_WHITELIST', submittedRequest }
}

export const hideWhitelist = () => {
  return { type: 'HIDE_WHITELIST' }
}