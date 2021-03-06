const _ = require('lodash')
const Shield = require('./subsystems/Shield')
const galaxy = require('./galaxy')

module.exports = class Player {
    constructor(input) {
        this.subsystems = {
            shield: new Shield()
        }

        this.input = input
        this.maxEnergy = 80000
        this.energy = this.maxEnergy
        this.isDocked = false
        this.skipTurns = 0
        this.currentQuadrant = galaxy.getQuadrantAt(0)
        this.currentSector = this.currentQuadrant.getSectorAt(0)
    }

    takeTurn() {
        if (this.skipTurns > 0) {
            this.skipTurns--
            this.rest()
            return
        }

        let command = this.input('Enter command: ')
        switch (command) {
            case 'raise': {
                this.subsystems.shield.raise()
                break
            }
            case 'lower': {
                this.subsystems.shield.lower()
                break
            }
            case 'transfer': {
                let energy = parseInt(this.input('Enter amount to transfer: '))
                if (energy > 0) {
                    this.transferEnergyToShield(energy)
                } else {
                    this.transferEnergyFromShield(-energy)
                }
                break
            }
            case 'dock': {
                this.dock()
                break
            }
            case 'rest': {
                this.skipTurns = parseInt(this.input('Enter amount of stardates: ')) * 10 - 1
                break
            }
            case 'warp': {
                let warp = this.input('Warp factor: ')
                let quadrant = this.input('Destination quadrant (x y): ').split(' ').map(n => parseInt(n))
                let sector = this.input('Destination sector (x y): ').split(' ').map(n => parseInt(n))
                this.warp(warp, {x: quadrant[0], y: quadrant[1]}, {x: sector[0], y: sector[1]})
                break
            }
        }

        this.rest()
    }

    damage(damageAmount) {
        let shield = this.subsystems.shield
        let damage = shield.absorbAttackAndReturnDamage(damageAmount)

        if (damage > 0) {
            let randomSubsystem = _.sample(this.subsystems)
            randomSubsystem.damageAmount++
        }
    }

    dock() {
        if (_.find(this.currentQuadrant.getAdjacentSectorsTo(this.currentSector), {entity: 'starbase'})) {
            this.energy = this.maxEnergy
            this.isDocked = true
        }
    }

    transferEnergyToShield(energy) {
        let { shield } = this.subsystems
        let extra = shield.addEnergyAndReturnExtra(energy)
        this.energy = this.energy - energy + extra
    }

    transferEnergyFromShield(energy) {
        let { shield } = this.subsystems
        let took = shield.takeEnergy(energy)
        this.energy += took
    }

    rest() {
        if (this.isDocked) {
            this.subsystems.shield.repair()
            this.subsystems.shield.repair()    
        }
        this.subsystems.shield.repair()
    }

    warp(factor, quadrant, sector) {
        factor
        quadrant
        sector
        // let destinationQuadrant = galaxy.quadrants[quadrant[0]][quadrant[1]]
        // let destinationSector = destinationQuadrant.sectors[sector[0]][sector[1]]

        // let distance = Math.sqrt( .. )

        // let time = sectors / Math.pow(factor, 2)
    }
}
