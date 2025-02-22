import { Tag } from 'antd'

export const TokenTag = (props: TokenTagProps) => {
  const color = props.token === TK_ERC20 ? '#A684FF' : '#ED6AFF'
  return (
    <Tag color={color} className={props.className}>
      {props.token}
    </Tag>
  )
}

export type TokenTagProps = {
  token: TokenType
  className?: string
}
