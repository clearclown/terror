declare module 'kuroshiro' {
  class Kuroshiro {
    init(analyzer: any): Promise<void>
    convert(text: string, options: { to: string; mode: string }): Promise<string>
  }
  export default Kuroshiro
}

declare module 'kuroshiro-analyzer-kuromoji' {
  class KuromojiAnalyzer {
    // KuromojiAnalyzer implementation
  }
  export default KuromojiAnalyzer
}
