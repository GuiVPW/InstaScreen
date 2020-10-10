import React, { useState, useEffect } from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, TouchableHighlight, ScrollView, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

import api from '../../services/api'

import { Divider } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import inputCreate from '../../components/InputCreate'
import TextFieldCreate from '../../components/InputCreate'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'

interface Images {
	author: string
	preview: any
	image: any
	description: any
	place: string
	hashtags: string
	loading: boolean
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	postItem: {
		marginTop: 20
	},

	postItemHeader: {
		paddingHorizontal: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	author: {
		fontSize: 17,
		color: '#000',
		marginTop: 5
	},

	place: {
		fontSize: 16,
		color: '#666',
		marginVertical: 20
	},

	postImage: {
		width: '100%',
		height: 300,
		marginTop: 0,
		marginBottom: 10,
		justifyContent: 'center'
	},

	image: {
		alignItems: 'center',
		padding: 10,
		margin: 15,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#CCC',
		borderStyle: 'dashed'
	},

	postItemFooter: {
		paddingHorizontal: 15
	},

	postLikes: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
		alignItems: 'center'
	},

	likes: {
		marginRight: 15,
		fontWeight: 'bold',
		color: '#000'
	},

	descriptions: {
		lineHeight: 18,
		marginBottom: 10,
		color: '#000',
		fontSize: 16
	},

	hashtags: {
		color: 'blue',
		marginBottom: 20,
		fontSize: 16
	},

	shareButton: {
		backgroundColor: 'black',
		borderRadius: 4,
		height: 50,
		margin: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},

	shareButtonText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#FFF'
	}

})

const Create = ({ navigation }) => {
	const [stateImage, setStateImage] = useState<Images>({
		author: '',
		preview: null,
		image: null,
		description: '',
		place: '',
		hashtags: '',
		loading: false
	})

	
	const getPermissionAsync = async () => {
		// @ts-ignore
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
				alert('Desculpe, nós precisamos da sua permissão para escolher a imagem!')
      }
    }
  }

	const selectImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
				quality: 1
			})
			
      if (!result.cancelled) {
				let prefix: string | number, ext: string, filename: any
				
				filename = result.uri.split('/').pop()
								
				if (filename) {
					[prefix, ext] = filename.split('.')
					ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext
				} else {
					prefix = new Date().getTime()
					ext = 'jpg'
				}

				const image = {
					uri: result.uri,
					type: result.type,
					name: `${prefix}.${ext}`
				}
				
				setStateImage({
					...stateImage,
					preview: result.uri,
					image: image.name
				})
      }
    } catch (E) {
			console.log(E)
    }
	}

	const onSubmit = async () => {
		try {
			const data = new FormData()

      data.append('image', stateImage.image)
      data.append('author', stateImage.author)
      data.append('place', stateImage.place)
      data.append('description', stateImage.description)
      data.append('hashtags', stateImage.hashtags)

			const create = await api.post('/posts', data)
			
			if (create) console.log(create)
			else console.log('Erro ao enviar, tente novamente!')

		} catch (e) {
			console.log(e)
		}
	}
	
	useEffect(() => { getPermissionAsync }, [])

  return (
    <ScrollView>
			<View style={styles.postItem}>

				<View style={styles.postItemHeader}>
					<View>
						<TextFieldCreate placeholder='Insira o nome do autor...' value={stateImage.author} style={styles.author} onChangeText={(author: string) => setStateImage({...stateImage, author})}/>
						<TextFieldCreate placeholder='Insira o lugar...' value={stateImage.place} style={styles.place} onChangeText={(place: string) => setStateImage({...stateImage, place})}/>
					</View>
				</View>

				<View>
					{stateImage.image ? (
						<>
							<Image source={{uri: stateImage.preview}} style={styles.postImage}/>
							<TouchableOpacity
								onPress={selectImage}
								style={styles.image}
							>
								<Text>Adicionar nova imagem</Text>
							</TouchableOpacity>
						</>
					) : (
						<View style={styles.postImage}>
							<TouchableOpacity
								onPress={selectImage}
								style={styles.image}
							>
								<Text>Adicionar uma imagem</Text>
							</TouchableOpacity>
						</View>
						)		
					}
				</View>

				<View style={styles.postItemFooter}>
					<View style={styles.postLikes}>
						<Icon name="heart-outline" style={styles.likes} size={25} />
						<Text style={styles.likes}>0 curtidas</Text>
					</View>

					<TextFieldCreate placeholder='Insira a descrição...' value={stateImage.description} style={styles.descriptions} onChangeText={(description: string) => setStateImage({...stateImage, description})}/>
					<TextFieldCreate placeholder='Insira as hashtags...' placeHolderTextColor="blue" autoCapitalize="none" value={stateImage.hashtags} style={styles.hashtags} onChangeText={(hashtags: string) => setStateImage({...stateImage, hashtags })}/>
				</View>

				{!stateImage.loading ? (
					<TouchableOpacity style={styles.shareButton} onPress={onSubmit}>
						<Text style={styles.shareButtonText}>Compartilhar</Text>
					</TouchableOpacity>
				) : ""}

			</View>
		</ScrollView>
  )
}

export default Create