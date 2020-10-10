import React from 'react'
import { TextInput } from 'react-native'

const TextFieldCreate = ({ ...rest }) => <TextInput placeholderTextColor='#999' autoCorrect={false} {...rest}/>

export default TextFieldCreate