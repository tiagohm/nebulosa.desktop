export type ConnectionType = 'INDI'

export type DeviceType = 'CAMERA' | 'MOUNT' | 'WHEEL' | 'FOCUSER' | 'ROTATOR' | 'GPS' | 'DOME' | 'GUIDE_OUTPUT' | 'LIGHT_BOX' | 'DUST_CAP'

export type CfaPattern = 'RGGB' | 'BGGR' | 'GBRG' | 'GRBG' | 'GRGB' | 'GBGR' | 'RGBG' | 'BGRG'

export enum PropertyState {
	IDLE = 'Idle',
	OK = 'Ok',
	BUSY = 'Busy',
	ALERT = 'Alert',
}

export interface Connect {
	host: string
	port: number
	type: ConnectionType
}

export interface ConnectionStatus extends Connect {
	id: string
	ip?: string
}

export interface DriverInfo {
	readonly executable: string
	readonly version: string
}

export interface Device {
	readonly type: DeviceType
	readonly id: string
	readonly name: string
	readonly driver: DriverInfo
	readonly client: ConnectionStatus
	readonly connected: boolean
}

export interface GuideOutput extends Device {
	readonly canPulseGuide: boolean
	readonly pulseGuiding: boolean
}

export function isGuideOutput(device?: Device): device is GuideOutput {
	return !!device && 'pulseGuiding' in device
}

export interface Thermometer extends Device {
	readonly hasThermometer: boolean
	readonly temperature: number
}

export function isThermometer(device?: Device): device is Thermometer {
	return !!device && 'temperature' in device
}

export interface Camera extends GuideOutput, Thermometer {
	hasCoolerControl: boolean
	coolerPower: number
	cooler: boolean
	hasDewHeater: boolean
	dewHeater: boolean
	frameFormats: string[]
	canAbort: boolean
	cfa: {
		offsetX: number
		offsetY: number
		type: CfaPattern
	}
	exposure: {
		time: number
		min: number
		max: number
		state: PropertyState
	}
	hasCooler: boolean
	canSetTemperature: boolean
	canSubFrame: boolean
	frame: {
		x: number
		minX: number
		maxX: number
		y: number
		minY: number
		maxY: number
		width: number
		minWidth: number
		maxWidth: number
		height: number
		minHeight: number
		maxHeight: number
	}
	canBin: boolean
	bin: {
		maxX: number
		maxY: number
		x: number
		y: number
	}
	gain: {
		value: number
		min: number
		max: number
	}
	offset: {
		value: number
		min: number
		max: number
	}
	pixelSize: {
		x: number
		y: number
	}
}

export function isCamera(device?: Device): device is Camera {
	return device?.type === 'CAMERA'
}

export const EMPTY_CAMERA: Camera = {
	hasCoolerControl: false,
	coolerPower: 0,
	cooler: false,
	hasDewHeater: false,
	dewHeater: false,
	frameFormats: [],
	canAbort: false,
	cfa: {
		offsetX: 0,
		offsetY: 0,
		type: 'RGGB',
	},
	exposure: {
		time: 0,
		min: 0,
		max: 0,
		state: PropertyState.IDLE,
	},
	hasCooler: false,
	canSetTemperature: false,
	canSubFrame: false,
	frame: {
		x: 0,
		minX: 0,
		maxX: 0,
		y: 0,
		minY: 0,
		maxY: 0,
		width: 0,
		minWidth: 0,
		maxWidth: 0,
		height: 0,
		minHeight: 0,
		maxHeight: 0,
	},
	canBin: false,
	bin: {
		maxX: 0,
		maxY: 0,
		x: 0,
		y: 0,
	},
	gain: {
		value: 0,
		min: 0,
		max: 0,
	},
	offset: {
		value: 0,
		min: 0,
		max: 0,
	},
	pixelSize: {
		x: 0,
		y: 0,
	},
	canPulseGuide: false,
	pulseGuiding: false,
	type: 'CAMERA',
	id: '',
	name: '',
	connected: false,
	driver: {
		executable: '',
		version: '',
	},
	client: {
		id: '',
		type: 'INDI',
		host: '',
		port: 0,
	},
	hasThermometer: false,
	temperature: 0,
}
