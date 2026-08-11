# -*- coding: utf-8 -*-
"""De stille vakman, in de houdingen die de video nodig heeft.

Alles op een canvas van 240 x 270, met de rand van de toonbank op y=254. Zo kun je
elke houding op dezelfde plek in een keyframe zetten en blijft hij van shot tot shot
dezelfde man.

Huisstijlregels (`.claude/skills/lets-brew-house-style/SKILL.md`): elke contour twee
keer met een eigen afwijking, lijnen die voorbij de hoek doorschieten, geen vulling en
geen arcering. `class="b"` is de tweede, lichtere pass; `class="d"` is een detail dat
nog verder naar achteren valt.
"""

# ---------------------------------------------------------------- het hoofd
# In elke houding identiek. Dit is wat hem herkenbaar houdt, dus hier verandert
# niets -- ook niet als een houding erom vraagt.
KOP = """
<path d="M147 48 Q146 20 120 17 Q94 20 92 52 Q91 80 120 85 Q147 81 148 56 Q149 49 146 43"/>
<path class="b" d="M144 55 Q142 25 120 23 Q99 26 96 53 Q95 76 120 80 Q143 77 145 58"/>
<path d="M95 42 Q101 20 122 18 Q144 17 149 40"/>
<path class="b" d="M99 34 Q112 25 127 26"/>
<path class="b" d="M131 24 Q143 29 147 40"/>
<path class="d" d="M104 28 Q116 21 128 22"/>
<path d="M92 50 Q85 53 87 62 Q89 68 95 66"/>
<path d="M148 50 Q155 53 153 62 Q151 68 145 66"/>
<path d="M105 53 Q110 49 115 53"/>
<path d="M126 53 Q131 49 136 53"/>
<path class="d" d="M104 45 Q110 42 116 45"/>
<path class="d" d="M125 45 Q131 42 137 45"/>
<path d="M120 57 Q116 66 122 69"/>
<path d="M110 75 Q120 79 131 73"/>
"""

# ------------------------------------------------------- hals, romp en schort
ROMP = """
<path d="M110 85 Q109 95 107 101"/>
<path d="M133 85 Q134 95 136 101"/>
<path class="b" d="M112 88 Q111 96 110 100"/>
<path d="M107 101 Q120 112 136 100"/>
<path class="b" d="M110 103 Q120 110 133 103"/>
<path d="M107 102 Q82 107 66 128"/>
<path d="M136 102 Q160 107 176 128"/>
<path class="b" d="M110 106 Q87 111 71 130"/>
<path class="b" d="M133 106 Q155 111 171 130"/>
<path d="M66 128 Q57 182 60 250"/>
<path d="M176 128 Q185 182 182 250"/>
<path class="b" d="M71 134 Q63 184 65 244"/>
<path class="b" d="M171 134 Q179 184 177 244"/>
<path d="M112 104 Q107 126 104 146"/>
<path d="M131 104 Q136 126 139 146"/>
<path class="b" d="M115 108 Q111 128 108 144"/>
<path class="b" d="M128 108 Q132 128 135 144"/>
<path d="M98 146 Q121 141 145 147"/>
<path d="M99 143 Q120 150 144 143"/>
<path d="M99 145 Q94 192 92 224"/>
<path d="M145 145 Q150 192 152 224"/>
<path d="M92 224 Q87 242 85 254"/>
<path d="M152 224 Q157 242 159 254"/>
<path class="b" d="M95 151 Q90 194 88 222"/>
<path class="b" d="M149 151 Q154 194 156 222"/>
<path d="M104 198 Q121 194 140 198"/>
<path d="M104 198 Q103 213 105 222"/>
<path d="M140 198 Q141 213 139 222"/>
<path d="M105 222 Q121 227 139 221"/>
<path class="d" d="M107 202 Q121 199 137 202"/>
<path class="b" d="M124 196 Q131 187 139 192"/>
"""

# de opgerolde mouwen horen bij de arm, dus die zitten per houding hieronder

# --------------------------------------------------------------- de houdingen

# 1 · rust: armen gevouwen. Het beginshot en de basis voor het karakterblad.
ARMEN_RUST = """
<path d="M59 164 Q72 158 84 164"/>
<path d="M60 175 Q73 169 85 175"/>
<path class="d" d="M60 170 Q72 165 84 170"/>
<path d="M183 164 Q170 158 158 164"/>
<path d="M182 175 Q169 169 157 175"/>
<path d="M82 180 Q112 200 160 190"/>
<path d="M163 184 Q132 206 86 196"/>
<path class="b" d="M86 184 Q114 202 158 193"/>
<path class="b" d="M160 188 Q130 208 90 199"/>
<path d="M156 184 Q167 186 169 194 Q168 202 158 201"/>
<path d="M88 192 Q77 194 75 202 Q76 210 86 209"/>
<path class="d" d="M92 197 Q99 195 105 198"/>
"""

# 2 · een zak omhoog in de linkerhand, telefoon in de rechter
ARMEN_ZAK = """
<path d="M59 164 Q70 157 82 163"/>
<path d="M60 175 Q71 168 83 174"/>
<path d="M64 170 Q54 198 62 220"/>
<path d="M84 168 Q76 196 84 216"/>
<path class="b" d="M68 174 Q59 198 66 216"/>
<path d="M62 220 Q56 210 58 198"/>
<path d="M62 220 Q72 226 82 220 Q86 212 84 204"/>
<path class="d" d="M66 214 Q74 212 80 215"/>
<path d="M183 164 Q172 157 160 163"/>
<path d="M182 175 Q171 168 159 174"/>
<path d="M178 170 Q190 192 186 212"/>
<path d="M158 168 Q166 190 162 208"/>
<path class="b" d="M174 174 Q185 192 182 208"/>
<path d="M186 212 Q192 204 190 194"/>
<path d="M162 208 Q170 216 182 212 Q188 204 186 196"/>
<path class="d" d="M168 208 Q176 206 183 209"/>
"""

# 3 · aan de machine: de linkerarm reikt naar buiten, naar de portafilter naast hem
ARMEN_MACHINE = """
<path d="M59 164 Q71 158 83 164"/>
<path d="M60 175 Q72 169 84 175"/>
<path d="M64 178 Q46 200 32 226"/>
<path d="M84 176 Q66 198 52 224"/>
<path class="b" d="M68 182 Q51 202 38 224"/>
<path d="M32 226 Q21 231 23 240 Q29 247 42 245 Q54 242 55 234 Q55 228 52 224"/>
<path class="d" d="M29 238 Q38 235 48 237"/>
<path class="d" d="M31 243 Q39 241 47 243"/>
<path d="M183 166 Q172 160 161 166"/>
<path d="M182 177 Q171 171 160 177"/>
<path d="M178 172 Q184 202 176 228"/>
<path d="M158 172 Q164 200 156 226"/>
<path class="b" d="M174 178 Q179 202 172 224"/>
<path d="M176 228 Q187 232 187 240 Q184 247 172 246 Q160 244 158 236 Q158 229 160 226"/>
<path class="d" d="M164 238 Q172 235 181 238"/>
"""

# 4 · de ketel: de rechterarm naar buiten, hand om het handvat; de linker aan de bank
ARMEN_KETEL = """
<path d="M59 164 Q72 158 84 164"/>
<path d="M60 175 Q73 169 85 175"/>
<path d="M64 178 Q58 208 68 230"/>
<path d="M84 176 Q80 206 88 228"/>
<path class="b" d="M68 182 Q63 208 72 226"/>
<path d="M68 230 Q60 234 60 242 Q63 249 74 248 Q86 246 88 238 Q88 231 86 228"/>
<path class="d" d="M65 238 Q73 235 82 238"/>
<path d="M183 166 Q173 159 162 165"/>
<path d="M182 177 Q172 170 161 176"/>
<path d="M178 172 Q194 190 202 212"/>
<path d="M158 172 Q174 190 182 210"/>
<path class="b" d="M174 178 Q189 194 196 212"/>
<path d="M202 212 Q212 217 211 226 Q205 232 193 230 Q182 226 181 218 Q182 212 184 209"/>
<path class="d" d="M188 222 Q196 220 205 222"/>
<path class="d" d="M187 227 Q194 226 201 227"/>
"""

# 5 · het slot: kopje omhoog in de rechterhand, telefoon naar de camera in de linker
ARMEN_SLOT = """
<path d="M59 164 Q70 157 82 163"/>
<path d="M60 175 Q71 168 83 174"/>
<path d="M64 170 Q52 194 58 216"/>
<path d="M84 168 Q74 192 80 212"/>
<path class="b" d="M68 174 Q57 194 62 212"/>
<path d="M58 216 Q54 206 56 196"/>
<path d="M58 216 Q68 222 78 216 Q82 208 80 200"/>
<path class="d" d="M62 210 Q70 208 76 211"/>
<path d="M183 164 Q172 157 160 163"/>
<path d="M182 175 Q171 168 159 174"/>
<path d="M178 170 Q188 186 182 202"/>
<path d="M158 168 Q168 184 162 198"/>
<path class="b" d="M174 176 Q183 188 178 200"/>
<path d="M182 202 Q176 190 178 178"/>
<path d="M162 198 Q172 204 182 198 Q186 190 184 182"/>
<path class="d" d="M166 194 Q174 192 180 195"/>
"""

# --------------------------------------------------------------- rekwisieten
# De brewers en de machine komen uit de app zelf (zie bouw-keyframes.py); wat de
# app niet heeft staat hier.

# de koffieboon uit de app-achtergrond, groot getekend
BOON = """
<path d="M40 128 Q46 62 120 40 Q198 50 208 122 Q204 196 126 214 Q48 206 38 134"/>
<path class="b" d="M48 128 Q54 70 121 50 Q192 60 200 122 Q196 188 126 204 Q56 196 46 132"/>
<path d="M118 42 Q92 78 96 126 Q100 178 124 212"/>
<path class="b" d="M124 46 Q100 82 104 126 Q108 174 128 208"/>
<path class="d" d="M62 96 Q74 88 84 94"/>
<path class="d" d="M156 158 Q168 150 178 156"/>
"""

# een zak koffie: alleen een vorm en een getekend logo, nooit letters
ZAK = """
<path d="M18 46 Q60 38 102 46"/>
<path d="M20 44 Q14 118 20 190"/>
<path d="M100 44 Q106 118 100 190"/>
<path d="M18 188 Q60 196 102 188"/>
<path class="b" d="M24 50 Q60 44 96 50"/>
<path class="b" d="M26 50 Q21 118 26 184"/>
<path class="b" d="M94 50 Q99 118 94 184"/>
<path class="b" d="M24 184 Q60 191 96 184"/>
<path d="M28 44 Q34 26 60 24 Q88 26 92 44"/>
<path class="b" d="M34 42 Q39 32 60 30 Q82 32 86 42"/>
<path d="M44 96 Q60 88 76 96 Q80 110 70 118 Q60 122 50 118 Q40 110 44 96"/>
<path class="b" d="M48 100 Q60 94 72 100 Q75 110 67 115 Q60 118 53 115 Q45 110 48 100"/>
<path class="d" d="M60 90 Q56 106 62 118"/>
<path class="d" d="M36 142 Q60 137 84 143"/>
<path class="d" d="M40 154 Q60 150 80 155"/>
"""

# een telefoon: vier losse randen, scherm leeg (de app komt uit de opnames)
TELEFOON = """
<path d="M8 10 Q4 78 9 148"/>
<path d="M6 14 Q40 8 74 15"/>
<path d="M72 10 Q77 78 72 148"/>
<path d="M74 144 Q40 151 6 143"/>
<path class="b" d="M13 18 Q10 78 14 142"/>
<path class="b" d="M12 20 Q40 14 68 21"/>
<path class="b" d="M66 18 Q70 78 66 141"/>
<path class="b" d="M68 138 Q40 144 13 138"/>
"""

# een kopje met schotel
KOPJE = """
<path d="M10 12 Q46 4 82 12"/>
<path d="M10 12 Q16 48 32 60"/>
<path d="M82 12 Q76 48 60 60"/>
<path d="M32 60 Q46 65 60 60"/>
<path class="b" d="M16 16 Q46 10 76 16"/>
<path d="M82 18 Q102 16 102 34 Q100 48 84 46"/>
<path class="b" d="M84 24 Q97 22 97 34 Q96 43 85 42"/>
<path d="M18 68 Q46 76 74 68"/>
<path class="b" d="M24 71 Q46 77 68 71"/>
<path class="d" d="M22 22 Q46 17 70 22"/>
"""

# een zwanenhalsketel
KETEL = """
<path d="M22 58 Q64 50 106 58"/>
<path d="M24 56 Q18 106 30 134"/>
<path d="M104 56 Q110 106 98 134"/>
<path d="M28 134 Q64 142 100 134"/>
<path class="b" d="M30 62 Q64 56 98 62"/>
<path class="b" d="M31 62 Q26 106 36 130"/>
<path class="b" d="M97 62 Q102 106 92 130"/>
<path d="M44 56 Q46 40 64 38 Q84 40 86 56"/>
<path class="b" d="M50 54 Q52 45 64 44 Q78 45 80 54"/>
<path d="M104 66 Q136 66 140 40 Q142 18 128 8"/>
<path class="b" d="M104 72 Q132 72 135 46 Q137 26 126 14"/>
<path d="M128 8 Q120 4 116 10"/>
<path d="M22 72 Q4 76 6 96 Q8 112 24 114"/>
<path class="b" d="M24 78 Q11 82 13 96 Q15 108 26 110"/>
"""

# de rand van de toonbank -- staat in elke houding op dezelfde hoogte
BANK = """
<path d="M-30 254 Q120 262 270 253"/>
<path class="b" d="M-28 259 Q120 267 268 258"/>
"""

HOUDINGEN = {
    'rust':    ARMEN_RUST,
    'zak':     ARMEN_ZAK,
    'machine': ARMEN_MACHINE,
    'ketel':   ARMEN_KETEL,
    'slot':    ARMEN_SLOT,
}


def vakman(houding='rust', bank=True):
    """De hele figuur als SVG-paden, op een canvas van 240 x 270."""
    return KOP + ROMP + HOUDINGEN[houding] + (BANK if bank else '')
