# 如何使用 viem 库查询以太坊的事件

```javascript
// 1. 基础设置
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// 创建客户端
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// 2. 查询最新事件
const logs = await client.getLogs({
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC 合约地址
  event: {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value' },
    ],
  },
  fromBlock: 18500000n,
  toBlock: 18500100n,
})

// 3. 使用合约 ABI 查询事件
const abi = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value' },
    ],
  },
]

const contract = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  abi,
}

// 使用 watchEvent 监听实时事件
const unwatch = client.watchEvent({
  address: contract.address,
  event: contract.abi[0],
  onLogs: logs => console.log(logs),
})

// 4. 按区块范围查询历史事件
async function getHistoricalEvents() {
  const events = await client.getLogs({
    address: contract.address,
    event: contract.abi[0],
    fromBlock: 18500000n,
    toBlock: 18500100n,
  })
  return events
}

// 5. 使用过滤器查询特定地址的事件
const filter = await client.createEventFilter({
  address: contract.address,
  event: contract.abi[0],
  args: {
    from: '0x1234...', // 特定的发送地址
    to: '0x5678...', // 特定的接收地址
  },
  fromBlock: 18500000n,
})

const events = await client.getFilterLogs({ filter })
```

# block提供什么类型的值

1. 字符串
   'earliest' 从创世区块开始
   'latest' 从最新区块开始
   'pending' 从pending区块开始
   'safe' 从safe区块开始
   'finalized' 从finalized区块开始

2. bigint
   从创世区块开始的区块号

# getLogs 和 createEventFilter 很像，有什么区别呢

1. 持久性

```javascript
// getLogs: 直接一次性查询，立即返回结果
const logs = await client.getLogs({
  address: contract.address,
  event: abi[0],
  fromBlock: 18500000n,
  toBlock: 18500100n,
})

// createEventFilter: 创建持久化的过滤器，需要后续调用 getFilterChanges 获取结果
const filter = await client.createEventFilter({
  address: contract.address,
  event: abi[0],
  fromBlock: 18500000n,
})
// 需要定期调用来获取新事件
const newLogs = await client.getFilterChanges({ filter })
```

2. 释放

```javascript
// createEventFilter 重用同一个过滤器
const filter = await client.createEventFilter({
  /* ... */
})
// 第一次获取
const changes1 = await client.getFilterChanges({ filter })
// 过一会儿再次获取新的变化
const changes2 = await client.getFilterChanges({ filter })
// 使用完需要清理
await client.uninstallFilter({ filter })
```

# 我事件中记录的用户钱包地址，怎么大小写不一致个的

address--0xbab6d6666fc2b3d581feabd30829fe392c2e86b5
sender---0xbaB6D6666fC2b3d581feaBd30829fe392C2E86B5

在以太坊中，地址的大小写确实是不区分的
以太坊地址本质上是一个 20 字节（40 个十六进制字符）的值。
小写是为了方便用户输入，大写是为了方便用户阅读。
地址中的大写字母实际上是一种校验和（checksum）格式，这是 EIP-55 提出的标准。这种格式通过特定算法确定哪些字母应该大写，哪些应该小写，用来帮助验证地址的正确性。

```javascript
import { getAddress } from 'viem'

// 全小写地址
const lowercaseAddress = '0xbab6d6666fc2b3d581feabd30829fe392c2e86b5'

// 转换为 EIP-55 格式（带校验和的大小写格式）
const checksumAddress = getAddress(lowercaseAddress)
// 结果: 0xbaB6D6666fC2b3d581feaBd30829fe392C2E86B5
```

如果你想了解具体的计算过程：

1. 取地址的 Keccak-256 哈希值
2. 对地址的每个字符：
   - 如果是数字(0-9)保持不变
   - 如果是字母(a-f)：
     查看哈希值对应位置的值
     如果该位 >= 8，字母转大写
     如果该位 < 8，字母保持小写
