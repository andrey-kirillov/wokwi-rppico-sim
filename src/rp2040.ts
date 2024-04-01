import * as fs from 'fs';

import { loadHex } from './utils/intelHex';
import COLORS from './utils/nodeColors';


console.log(COLORS.fg.blue, 'HELLO RP2040!');

class RP2040 {
  /** ------------------------------------------ Addresses ---------------------------------------------------------- */

  /**
   * SRAM
   * 264 KB
   * starts at 0x20000000
   */
  private sram = new Uint8Array(264 * 1024);

  /**
   * FLASH
   * 16 MB
   * starts at 0x10000000
   */
  private flash = new Uint8Array(16 * 1024 * 1024); // byte size
  private flash16 = new Uint16Array(this.flash.buffer);   // word size (2 x byte)

  /**
   * 16
   */
  private registers = new Uint32Array(16);

  /**
   * ROM
   */

  /**
   * APB Peripherals
   */

  /** ---------------------------------------- Constructor ---------------------------------------------------------- */
  constructor(hex: string) {
    // console.log('loading hex\n', hex);
    this.SP = 0x20041000;
    this.flash.fill(0xff);
    loadHex(hex, this.flash);
  }

  /** ------------------------------------------ Registers ---------------------------------------------------------- */

  /**
   * Program counter
   */
  get PC() {
    return this.registers[15];
  }

  set PC(value: number) {
    this.registers[15] = value;
  }

  /**
   * Stack pointer
   */
  get SP() {
    return this.registers[13];
  }

  set SP(value: number) {
    this.registers[13] = value;
  }

  /**
   * Link register
   */
  get LR() {
    return this.registers[14];
  }

  set LR(value: number) {
    this.registers[14] = value;
  }

  /** ------------------------------------------ Methods ------------------------------------------------------------ */
  executeInstruction() {
    const opcode = this.flash16[this.PC / 2];

    if ((opcode >> 9) === 0b1011010) {
      console.log(COLORS.fg.green, 'instruction: push');
    }

    console.log('opcode', {
      opcode,
      opcodeBin: opcode.toString(2).replace(/^(.{8})/,"$1 "),
      opcodeHex: opcode.toString(16),
      // flash16: this.flash16,
      // flash: this.flash,
    });
  }
}

/** ----------------------------------------------- Test ------------------------------------------------------------ */

const hex = fs.readFileSync('src/utils/blink.hex', 'utf-8');

const mcu = new RP2040(hex);
mcu.PC = 0x304;
mcu.executeInstruction();

console.log(COLORS.fg.blue, 'BYE RP2040!');
