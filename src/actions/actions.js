export const load = (table) => ({
    type: 'LOAD',
    table: table
})

export const changeFlag = (flag) => ({
    type: 'CHANGE_FLAG',
    flag: flag
})

export  const currentUser = (user) => ({
    type: 'CURRENT_USER',
    user: user
})

export const changeTableFlag = (flag) => ({
    type: 'CHANGE_TABLE_FLAG',
    flag: flag
})