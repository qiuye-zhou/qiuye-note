---
lang: zh-CN
title: Redis
description: Redis
---
# Redis

#### Redis数据类型

##### String(字符串)
string是redis最基本的类型(一个键最大能存储512MB)，一个key(唯一标识)对应一个value(值)

string类型是二进制安全的，即redis的string可以包含任何数据，比如图片、序列化的对象等。

应用场景: `缓存对象`，`常数计算`，`共享session信息`，`分布式锁`等等

缓存对象: 
1. 直接缓存整个对象的JSON
2. 将key分离，采用MSET存储，用MGET获取属性值
```shell
redis> MSET data1 "isdata" data2 "isdata2" data3 "isdata3"
OK

redis> MGET data1 data2 data3
1) "data1"
2) "data2"
3) "data3"
```

常数计算:

因为Redis处理命令是单线程的，所以执行命令的过程是原子的。因此string类型适合常数计算(计算访问次数、点赞、转发、库存数量等等)
```shell
# 初始化数量
redis> SET atc 0
OK

# +1
redis> INCR atc
(integer) 1

# +1
redis> INCR atc
(integer) 2

# 获取数量
redis> GET atc
(integer) 2
```

共享session信息:

通常开发后台管理系统时，会使用session保存用户登入状态，这些session信息会保存在服务端，但这只适用于单系统应用，分布式系统则不适用

所以可以借助 redis 对这些 Session 信息进行统一的存储和管理，无论请求发送哪个服务器，都能去同一个redis获取session信息

分布式锁:

使用SET命令的NX参数实现分布锁
如果key不存在，则显示插入成功，可以用来表示加锁成功；
如果key存在，则会显示插入失败，可以用来表示加锁失败。
```shell
redis?> SET lock uuid NX PX 10000
OK
```
- lock key
- uuid 客户端生成的唯一标识
- NX 代表lock不存在时，才对lock进行设置
- PX 10000 设置过期时间，防止客户端发生异常而无法释放锁

解锁的时候，要先判断uuid是否为加锁客户端，是才删除


##### Hash(哈希)
Redis hash是一个键值对(key-value)集合，value([data1.value1, data2.value2 ... datax.valuex])

应用场景: `缓存对象`，`购物车`

缓存对象: 
```shell
# 存储一个哈希表 uid1 的键值
redis> HSET uid1 name age name1 age1
(integer) 2

# 存储一个哈希表 uid2 的键值
redis> HSET uid2 name age name2 age2
(integer) 2

# 获取哈希表用户 id1 中所有的键值
HGETALL uid1
1) "naem"
2) "age"
3) "name1"
4) "age1"
```
一般对象用string --- json存储，对象中频繁变化的属性可以考虑用hash类型存储

购物车:
```shell
# 添加商品
HSET cart{用户id} {商品id} 1

#添加数量
HINCRBY cart{用户id} {商品id} 1

#商品总数
HLEN cart{用户id}

# 删除商品
HDEL cart{用户id} {商品id}

# 获取购物车所有商品
HEGTALL cart{用户id}
```
这里存储的是对应的id，在显示商品具体信息的时候，还是需要通过商品id等查询数据库获取完整信息

##### List(列表)
redis列表是简单的字符串列表，按照插入顺序排序。可以添加一个元素到列表的头部（左边）或者尾部（右边）

```shell
# 将一个或多个插入到key列表的表头(最左边),最后的值在最前面
# LPUSH key element [element ...]
redis> LPUSH list a b c

# 将一个或多个插入到key列表的表尾(最右边)
# RPUSH key element [element ...]
redis> RPUSH list d e f

# 移除并返回列表头元素
# LPOP key [cont] (--可选属性cont 设置个数--)
redis> LPOP list
"c"

# 移除并返回 key 列表的尾元素
# RPOP key [count]
redis> RPOP list
"f"

# 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定，从0开始
# LRANGE key start stop
redis> LPANGE list 0 3

# 通过下标获得 key 列表中的某一个值
# LINDEX key index
redis> LINDEX list 2
"e"
redis> LINDEX list 6
(nil)

# 返回 key 列表的长度
# LLEN key
redis> LLEN list
(integer) 3
```

应用场景：`消息队列`等
[详细](https://juejin.cn/post/7148687227038466078)

##### Set(集合)
redis的Set是string类型的无序集合。

集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。

##### zset(sorted set: 有序集合)
redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。

不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。

zset的成员是唯一的,但分数(score)却可以重复。

#### 命令

```
数据库索引号 index 用数字值指定，以 0 作为起始索引值(默认0)
select index // 切换到指定的数据库

keys * //返回所有键名

keys a* // 返回a开头key

set KEY_NAME KEY_VALUE // 设置一对key value

setex KEY_NAME KEY_VALUE // 设置key 过期时间 value

get KEY_NAME // 获取该 key 存储的值

del KEY_NAME // 删除已存在的键。不存在的 key 会被忽略

flushdb // 清空当前数据库中的所有key

ttl KEY_NAME // 以秒为单位返回 key 的剩余过期时间。

type KEY_NAME // 返回 key 所储存的值的类型。
```
[更多命令](https://www.redis.net.cn/order/)


#### 参考地址
[https://juejin.cn/column/7147879426628255751](https://juejin.cn/column/7147879426628255751)

[https://www.redis.net.cn/](https://www.redis.net.cn/)