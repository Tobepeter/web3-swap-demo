# 合约基础设置

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

- 这是许可证声明和 Solidity 版本声明
- ^0.8.28 表示合约兼容 0.8.28 及以上版本（但不包括 0.9.0）

# 状态变量

uint public unlockTime;      // 解锁时间
address payable public owner;  // 合约拥有者地址

- 这两个变量都是 public 的，会自动生成 getter 函数
- unlockTime 存储资金可以提取的时间戳
- owner 存储合约创建者的地址，并且是 payable 类型（可以接收以太币）

# 事件声明

event Withdrawal(uint amount, uint when);

定义了一个提款事件，记录提款金额和时间
这个事件会在提款时被触发，可以用于前端监听或区块链浏览器查看

# 构造函数

constructor(uint _unlockTime) payable {
    require(
        block.timestamp < _unlockTime,
        "Unlock time should be in the future"
    );

    unlockTime = _unlockTime;
    owner = payable(msg.sender);
}

- 构造函数是 payable 的，意味着部署合约时可以同时发送以太币
- 接受一个参数 _unlockTime，指定解锁时间
- 检查解锁时间必须在未来
- 设置合约拥有者为部署合约的地址

# 提款函数

function withdraw() public {
    require(block.timestamp >= unlockTime, "You can't withdraw yet");
    require(msg.sender == owner, "You aren't the owner");

    emit Withdrawal(address(this).balance, block.timestamp);

    owner.transfer(address(this).balance);
}

- 公开的提款函数，允许提取合约中的所有以太币
- 有两个检查条件：
  - 当前时间必须大于或等于解锁时间
  - 调用者必须是合约拥有者
- 触发 Withdrawal 事件，记录提款信息
- 将合约中的所有余额转移给 owner

# 实际用途

这个合约的主要功能是：

- 在部署时锁定一定数量的以太币
- 设定一个未来的时间点
- 只有到达指定时间后，合约拥有者才能提取这些以太币





