import { loadHex } from './utils/intelHex';
import * as fs from 'fs';

console.log('\x1b[36m%s\x1b[0m', 'HELLO RP2040!');

class RP2040 {
  /**
   * SRAM
   * 264 KB
   * starts at 0x20000000
   */
  private sram =  new Uint8Array( 264 * 1024);

  /**
   * FLASH
   * 16 MB
   * starts at 0x10000000
   */
  private flash =  new Uint8Array( 16 * 1024 * 1024); // byte size
  private flash16 =  new Uint16Array(this.flash.buffer);   // word size (2 x byte)

  /**
   * 16 registers
   */
  private registers = new Uint32Array(16);

  /**
   * ROM
   */

  /**
   * APB Peripherals
   */

  constructor(hex: string) {
    // console.log('loading hex\n', hex);
    loadHex(hex, this.flash);
  }

  get PC() {
    return this.registers[15];
  }

  set PC(value: number) {
    this.registers[15] = value;
  }

  executeInstruction() {
    const opcode = this.flash16[this.PC / 2];
    // console.log('opcode', {
    //   opcode,
    //   opcodeHex: opcode.toString(16),
    //   flash16: this.flash16,
    //   flash: this.flash,
    // });
  }
}

/** ---------------------------------------------------------------------------------------------------------------- */

const hex = fs.readFileSync('src/utils/blink.hex', 'utf-8');

const mcu = new RP2040(hex);
mcu.executeInstruction();

console.log('\x1b[36m%s\x1b[0m', 'BYE RP2040!');
