import{a as Ge,f as Ct,e as $i,s as Rr,t as ji}from"../chunks/DEV_ARec.js";import{i as qi,p as Yi,a as Ji,e as Mr,d as Ar,s as Ki,t as Ie,f as Ue}from"../chunks/CuB-nzEn.js";import{p as Qi,m as Mt,k as F,o as Zi,l as ot,q as Js,t as eo,f as fs,v as to,w as Vr,x as so,s as Me,c as ze,z as nt,r as Be,u as Ks,n as kr,y as ro,A as Ir,B as io}from"../chunks/BxEFjS1y.js";import{a as Ur,b as oo,i as Qs}from"../chunks/mHV_ja7I.js";import{k as no}from"../chunks/By_dfg-L.js";import{g as zr}from"../chunks/BvRZ6NtP.js";import{p as ao}from"../chunks/CIBmc7mf.js";import{H as fo,F as co}from"../chunks/Deb2xHlh.js";import{P as lo}from"../chunks/DPup8fwQ.js";const oi=`
precision highp float;
in vec3 position;
void main() {
    gl_Position = vec4(position, 1.0);
}
`,ho=`
precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1.0);
}
`,ni=`
precision highp float;
uniform vec2 offset;
uniform vec2 resolution;
uniform sampler2D src;
out vec4 outColor;
void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) {
        discard;
    }
    outColor = texture(src, uv);
}
`,H=`precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform bool autoCrop;
uniform sampler2D src;
out vec4 outColor;
`,N=`vec4 readTex(sampler2D tex, vec2 uv) {
    if (autoCrop && (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.)) {
        return vec4(0);
    }
    return texture(tex, uv);
}`,Br={none:ni,uvGradient:`
    ${H}
    ${N}

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        outColor = vec4(uv, sin(time) * .5 + .5, 1);

        vec4 img = readTex(src, uv);
        outColor *= smoothstep(0., 1., img.a);
    }
    `,rainbow:`
    ${H}
    ${N}

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hueShift(vec3 rgb, float t) {
        vec3 hsv = rgb2hsv(rgb);
        hsv.x = fract(hsv.x + t);
        return hsv2rgb(hsv);
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec2 uv2 = uv;
        uv2.x *= resolution.x / resolution.y;

        float x = (uv2.x - uv2.y) - fract(time);

        vec4 img = readTex(src, uv);
        float gray = length(img.rgb);

        img.rgb = vec3(hueShift(vec3(1,0,0), x) * gray);

        outColor = img;
    }
    `,glitch:`
    ${H}
    ${N}

    float nn(float y, float t) {
        float n = (
            sin(y * .07 + t * 8. + sin(y * .5 + t * 10.)) +
            sin(y * .7 + t * 2. + sin(y * .3 + t * 8.)) * .7 +
            sin(y * 1.1 + t * 2.8) * .4
        );

        n += sin(y * 124. + t * 100.7) * sin(y * 877. - t * 38.8) * .3;

        return n;
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);

        float t = mod(time, 3.14 * 10.);

        // Seed value
        float v = fract(sin(t * 2.) * 700.);

        if (abs(nn(uv.y, t)) < 1.2) {
            v *= 0.01;
        }

        // Prepare for chromatic Abbreveation
        vec2 focus = vec2(0.5);
        float d = v * 0.6;
        vec2 ruv = focus + (uv - focus) * (1. - d);
        vec2 guv = focus + (uv - focus) * (1. - 2. * d);
        vec2 buv = focus + (uv - focus) * (1. - 3. * d);

        // Random Glitch
        if (v > 0.1) {
            // Randomize y
            float y = floor(uv.y * 13. * sin(35. * t)) + 1.;
            if (sin(36. * y * v) > 0.9) {
                ruv.x = uv.x + sin(76. * y) * 0.1;
                guv.x = uv.x + sin(34. * y) * 0.1;
                buv.x = uv.x + sin(59. * y) * 0.1;
            }

            // RGB Shift
            v = pow(v * 1.5, 2.) * 0.15;
            color.rgb *= 0.3;
            color.r += readTex(src, vec2(uv.x + sin(t * 123.45) * v, uv.y)).r;
            color.g += readTex(src, vec2(uv.x + sin(t * 157.67) * v, uv.y)).g;
            color.b += readTex(src, vec2(uv.x + sin(t * 143.67) * v, uv.y)).b;
        }

        // Compose Chromatic Abbreveation
        if (abs(nn(uv.y, t)) > 1.1) {
            color.r = color.r * 0.5 + color.r * texture(src, ruv).r;
            color.g = color.g * 0.5 + color.g * texture(src, guv).g;
            color.b = color.b * 0.5 + color.b * texture(src, buv).b;
            color *= 2.;
        }

        outColor = color;
        outColor.a = smoothstep(0.0, 0.8, max(color.r, max(color.g, color.b)));
    }
    `,pixelate:`
    ${H}
    ${N}

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        float b = sin(time * 2.) * 32. + 48.;
        uv = floor(uv * b) / b;
        outColor = readTex(src, uv);
    }
    `,rgbGlitch:`
    ${H}
    ${N}

    float random(vec2 st) {
        return fract(sin(dot(st, vec2(948.,824.))) * 30284.);
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec2 uvr = uv, uvg = uv, uvb = uv;

        float tt = mod(time, 17.);

        if (fract(tt * 0.73) > .8 || fract(tt * 0.91) > .8) {
            float t = floor(tt * 11.);

            float n = random(vec2(t, floor(uv.y * 17.7)));
            if (n > .7) {
                uvr.x += random(vec2(t, 1.)) * .1 - 0.05;
                uvg.x += random(vec2(t, 2.)) * .1 - 0.05;
                uvb.x += random(vec2(t, 3.)) * .1 - 0.05;
            }

            float ny = random(vec2(t * 17. + floor(uv * 19.7)));
            if (ny > .7) {
                uvr.x += random(vec2(t, 4.)) * .1 - 0.05;
                uvg.x += random(vec2(t, 5.)) * .1 - 0.05;
                uvb.x += random(vec2(t, 6.)) * .1 - 0.05;
            }
        }

        vec4 cr = readTex(src, uvr);
        vec4 cg = readTex(src, uvg);
        vec4 cb = readTex(src, uvb);

        outColor = vec4(
            cr.r,
            cg.g,
            cb.b,
            step(.1, cr.a + cg.a + cb.a)
        );
    }
    `,rgbShift:`
    ${H}
    ${N}

    float nn(float y, float t) {
        float n = (
            sin(y * .07 + t * 8. + sin(y * .5 + t * 10.)) +
            sin(y * .7 + t * 2. + sin(y * .3 + t * 8.)) * .7 +
            sin(y * 1.1 + t * 2.8) * .4
        );

        n += sin(y * 124. + t * 100.7) * sin(y * 877. - t * 38.8) * .3;

        return n;
    }

    float step2(float t, vec2 uv) {
        return step(t, uv.x) * step(t, uv.y);
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec2 uvr = uv, uvg = uv, uvb = uv;

        float t = mod(time, 30.);

        float amp = 10. / resolution.x;

        if (abs(nn(uv.y, t)) > 1.) {
            uvr.x += nn(uv.y, t) * amp;
            uvg.x += nn(uv.y, t + 10.) * amp;
            uvb.x += nn(uv.y, t + 20.) * amp;
        }

        vec4 cr = readTex(src, uvr);
        vec4 cg = readTex(src, uvg);
        vec4 cb = readTex(src, uvb);

        outColor = vec4(
            cr.r,
            cg.g,
            cb.b,
            smoothstep(.0, 1., cr.a + cg.a + cb.a)
        );
    }
    `,halftone:`
    // Halftone Effect by zoidberg
    // https://www.interactiveshaderformat.com/sketches/234

    ${H}
    ${N}

    // TODO: uniform
    #define gridSize 10.0
    #define dotSize 0.7
    #define smoothing 0.15
    #define speed 1.0

    #define IMG_PIXEL(x, y) readTex(x, (y - offset) / resolution);

    vec4 gridRot = vec4(15.0, 45.0, 75.0, 0.0);

    // during calculation we find the closest dot to a frag, determine its size, and then determine the size of the four dots above/below/right/left of it. this array of offsets move "one left", "one up", "one right", and "one down"...
    vec2 originOffsets[4];

    void main() {
        vec2 fragCoord = gl_FragCoord.xy - offset;

        // a halftone is an overlapping series of grids of dots
        // each grid of dots is rotated by a different amount
        // the size of the dots determines the colors. the shape of the dot should never change (always be a dot with regular edges)
        originOffsets[0] = vec2(-1.0, 0.0);
        originOffsets[1] = vec2(0.0, 1.0);
        originOffsets[2] = vec2(1.0, 0.0);
        originOffsets[3] = vec2(0.0, -1.0);

        vec3 rgbAmounts = vec3(0.0);

        // for each of the channels (i) of RGB...
        for (float i=0.0; i<3.0; ++i) {
            // figure out the rotation of the grid in radians
            float rotRad = radians(gridRot[int(i)]);

            // the grids are rotated counter-clockwise- to find the nearest dot, take the fragment pixel loc,
            // rotate it clockwise, and split by the grid to find the center of the dot. then rotate this
            // coord counter-clockwise to yield the location of the center of the dot in pixel coords local to the render space
            mat2 ccTrans = mat2(vec2(cos(rotRad), sin(rotRad)), vec2(-1.0*sin(rotRad), cos(rotRad)));
            mat2 cTrans = mat2(vec2(cos(rotRad), -1.0*sin(rotRad)), vec2(sin(rotRad), cos(rotRad)));

            // find the location of the frag in the grid (prior to rotating it)
            vec2 gridFragLoc = cTrans * fragCoord.xy;

            // find the center of the dot closest to the frag- there's no "round" in GLSL 1.2, so do a "floor" to find the dot to the bottom-left of the frag, then figure out if the frag would be in the top and right halves of that square to find the closest dot to the frag
            vec2 gridOriginLoc = vec2(floor(gridFragLoc.x/gridSize), floor(gridFragLoc.y/gridSize));

            vec2 tmpGridCoords = gridFragLoc/vec2(gridSize);
            bool fragAtTopOfGrid = ((tmpGridCoords.y-floor(tmpGridCoords.y)) > (gridSize/2.0)) ? true : false;
            bool fragAtRightOfGrid = ((tmpGridCoords.x-floor(tmpGridCoords.x)) > (gridSize/2.0)) ? true : false;
            if (fragAtTopOfGrid)
                gridOriginLoc.y = gridOriginLoc.y + 1.0;
            if (fragAtRightOfGrid)
                gridOriginLoc.x = gridOriginLoc.x + 1.0;

            // ...at this point, "gridOriginLoc" contains the grid coords of the nearest dot to the fragment being rendered
            // convert the location of the center of the dot from grid coords to pixel coords
            vec2 gridDotLoc = vec2(gridOriginLoc.x*gridSize, gridOriginLoc.y*gridSize) + vec2(gridSize/2.0);

            // rotate the pixel coords of the center of the dot so they become relative to the rendering space
            vec2 renderDotLoc = ccTrans * gridDotLoc;

            // get the color of the pixel of the input image under this dot (the color will ultimately determine the size of the dot)
            vec4 renderDotImageColorRGB = IMG_PIXEL(src, renderDotLoc + offset);

            // the amount of this channel is taken from the same channel of the color of the pixel of the input image under this halftone dot
            float imageChannelAmount = renderDotImageColorRGB[int(i)];

            // the size of the dot is determined by the value of the channel
            float dotRadius = imageChannelAmount * (gridSize * dotSize);
            float fragDistanceToDotCenter = distance(fragCoord.xy, renderDotLoc);
            if (fragDistanceToDotCenter < dotRadius) {
                rgbAmounts[int(i)] += smoothstep(dotRadius, dotRadius-(dotRadius*smoothing), fragDistanceToDotCenter);
            }

            // calcluate the size of the dots abov/below/to the left/right to see if they're overlapping
            for (float j=0.0; j<4.0; ++j) {
                gridDotLoc = vec2((gridOriginLoc.x+originOffsets[int(j)].x)*gridSize, (gridOriginLoc.y+originOffsets[int(j)].y)*gridSize) + vec2(gridSize/2.0);

                renderDotLoc = ccTrans * gridDotLoc;
                renderDotImageColorRGB = IMG_PIXEL(src, renderDotLoc + offset);

                imageChannelAmount = renderDotImageColorRGB[int(i)];
                dotRadius = imageChannelAmount * (gridSize*1.50/2.0);
                fragDistanceToDotCenter = distance(fragCoord.xy, renderDotLoc);
                if (fragDistanceToDotCenter < dotRadius) {
                    rgbAmounts[int(i)] += smoothstep(dotRadius, dotRadius-(dotRadius*smoothing), fragDistanceToDotCenter);
                }
            }
        }

        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 original = readTex(src, uv);
        float alpha = step(.1, rgbAmounts[0] + rgbAmounts[1] + rgbAmounts[2] + original.a);

        outColor = vec4(rgbAmounts[0], rgbAmounts[1], rgbAmounts[2], alpha);
    }
    `,sinewave:`
    ${H}
    ${N}

    vec4 draw(vec2 uv) {
        vec2 uvr = uv, uvg = uv, uvb = uv;

        float amp = 20. / resolution.x;

        uvr.x += sin(uv.y * 7. + time * 3.) * amp;
        uvg.x += sin(uv.y * 7. + time * 3. + .4) * amp;
        uvb.x += sin(uv.y * 7. + time * 3. + .8) * amp;

        vec4 cr = readTex(src, uvr);
        vec4 cg = readTex(src, uvg);
        vec4 cb = readTex(src, uvb);

        return vec4(
            cr.r,
            cg.g,
            cb.b,
            cr.a + cg.a + cb.a
        );
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        // x blur
        vec2 dx = vec2(2, 0) / resolution.x;
        outColor = (draw(uv) * 2. + draw(uv + dx) + draw(uv - dx)) / 4.;
    }
    `,shine:`
    ${H}
    ${N}

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        vec2 p = uv * 2. - 1.;
        float a = atan(p.y, p.x);

        vec4 col = readTex(src, uv);
        float gray = length(col.rgb);

        float level = 1. + sin(a * 10. + time * 3.) * 0.2;

        outColor = vec4(1, 1, .5, col.a) * level;
    }
    `,blink:`
    ${H}
    ${N}

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        outColor = readTex(src, uv) * (sin(time * 5.) * 0.2 + 0.8);
    }

    `,spring:`
    ${H}
    ${N}

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        uv = (uv - .5) * (1.05 + sin(time * 5.) * 0.05) + .5;
        outColor = readTex(src, uv);
    }
    `,duotone:`
    ${H}
    ${N}

    uniform vec4 color1;
    uniform vec4 color2;
    uniform float speed;

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);

        float gray = dot(color.rgb, vec3(0.2, 0.7, 0.08));
        float t = mod(gray * 2.0 + time * speed, 2.0);

        if (t < 1.) {
            outColor = mix(color1, color2, fract(t));
        } else {
            outColor = mix(color2, color1, fract(t));
        }

        outColor.a *= color.a;
    }
    `,tritone:`
    ${H}
    ${N}

    uniform vec4 color1;
    uniform vec4 color2;
    uniform vec4 color3;
    uniform float speed;

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);

        float gray = dot(color.rgb, vec3(0.2, 0.7, 0.08));
        float t = mod(gray * 3.0 + time * speed, 3.0);

        if (t < 1.) {
            outColor = mix(color1, color2, fract(t));
        } else if (t < 2.) {
            outColor = mix(color2, color3, fract(t));
        } else {
            outColor = mix(color3, color1, fract(t));
        }

        outColor.a *= color.a;
    }
    `,hueShift:`
    ${H}
    ${N}

    uniform float shift;

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hueShift(vec3 rgb, float t) {
        vec3 hsv = rgb2hsv(rgb);
        hsv.x = fract(hsv.x + t);
        return hsv2rgb(hsv);
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);
        color.rgb = hueShift(color.rgb, shift);
        outColor = color;
    }
    `,warpTransition:`
    ${H}
    uniform float enterTime;
    uniform float leaveTime;

    ${N}

    #define DURATION 1.0

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        float t1 = enterTime / DURATION;
        float t2 = leaveTime / DURATION;
        float t = clamp(min(t1, 1. - t2), 0., 1.);

        if (t == 0.) {
            discard;
        }

        if (t < 1.) {
            uv.x += sin(floor(uv.y * 300.)) * 3. * exp(t * -10.);
        }

        outColor = readTex(src, uv);
    }
    `,slitScanTransition:`
    ${H}
    ${N}

    uniform float enterTime;
    uniform float leaveTime;

    #define DURATION 1.0

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        float t1 = enterTime / DURATION;
        float t2 = leaveTime / DURATION;

        // Do not render before enter or after leave
        if (t1 < 0. || 1. < t2) {
            discard;
        }

        if (0. < t2) {
            // Leaving
            float t = 1. - t2;
            uv.y = uv.y < t ? uv.y : t;
        } else if (t1 < 1.) {
            // Entering
            float t = 1. - t1;
            uv.y = uv.y < t ? t : uv.y;
        }

        outColor = readTex(src, uv);
    }
    `,pixelateTransition:`
    ${H}
    ${N}

    uniform float enterTime;
    uniform float leaveTime;

    #define DURATION 1.0

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        float t1 = enterTime / DURATION;
        float t2 = leaveTime / DURATION;
        float t = clamp(min(t1, 1. - t2), 0., 1.);

        if (t == 0.) {
            discard;
        } else if (t < 1.) {
            float b = floor(t * 64.);
            uv = (floor(uv * b) + .5) / b;
        }

        outColor = readTex(src, uv);
    }
    `,focusTransition:`
    ${H}
    ${N}

    uniform float intersection;

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        float t = smoothstep(0., 1., intersection);

        outColor = mix(
            readTex(src, uv + vec2(1. - t, 0)),
            readTex(src, uv + vec2(-(1. - t), 0)),
            0.5
        ) * intersection;
    }
    `,invert:`
    ${H}
    ${N}

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);
        outColor = vec4(1.0 - color.rgb, color.a);
    }
    `,grayscale:`
    ${H}
    ${N}

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec4 color = readTex(src, uv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        outColor = vec4(vec3(gray), color.a);
    }
    `,vignette:`
    ${H}
    ${N}

    uniform float intensity;
    uniform float radius;
    uniform float power;

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        outColor = readTex(src, uv);

        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;

        float l = max(length(p) - radius, 0.);
        outColor *= 1. - pow(l, power) * intensity;
    }
    `,chromatic:`
    ${H}
    ${N}

    uniform float intensity;
    uniform float radius;
    uniform float power;


    vec4 mirrorTex(sampler2D tex, vec2 uv) {
        vec2 uv2 = 1. - abs(1. - mod(uv, 2.0));
        return texture(tex, uv2);
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;

        float l = max(length(p) - radius, 0.);
        float d = pow(l, power) * (intensity * 0.1);

        vec2 uvR = (uv - .5) / (1.0 + d * 1.) + 0.5;
        vec2 uvG = (uv - .5) / (1.0 + d * 2.) + 0.5;
        vec2 uvB = (uv - .5) / (1.0 + d * 3.) + 0.5;

        vec4 cr = mirrorTex(src, uvR);
        vec4 cg = mirrorTex(src, uvG);
        vec4 cb = mirrorTex(src, uvB);

        outColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a) / 3.0);
    }
    `};function uo(r){if(!r.src||r.src.startsWith("data:"))return!1;try{return new URL(r.src,location.href).origin!==location.origin}catch{return!1}}async function po(r){const t=await(await fetch(r)).blob();return URL.createObjectURL(t)}async function mo(r){const t=Array.from(r.querySelectorAll("img")).filter(n=>n.complete&&n.naturalWidth>0&&uo(n));if(t.length===0)return()=>{};const s=new Map,i=[];return await Promise.all(t.map(async n=>{try{const a=await po(n.src);s.set(n,n.src),i.push(a),await new Promise(f=>{n.addEventListener("load",()=>f(),{once:!0}),n.src=a})}catch{}})),()=>{for(const[n,a]of s)n.src=a;for(const n of i)URL.revokeObjectURL(n)}}const vo=["margin-top","margin-right","margin-bottom","margin-left"],go=["position","top","right","bottom","left","float","flex","flex-grow","flex-shrink","flex-basis","align-self","justify-self","place-self","order","grid-column","grid-column-start","grid-column-end","grid-row","grid-row-start","grid-row-end","grid-area"],ir=new WeakMap,or=new WeakMap,nr=new WeakMap,ar=new WeakMap,fr=new WeakMap,cr=new WeakMap;async function wo(r,e){const t=r.getContext("2d");if(!t)throw new Error("Failed to get 2d context from layoutsubtree canvas");const{onCapture:s,maxSize:i}=e;let n=null,a=null;const f=new Promise(d=>{a=d});r.onpaint=()=>{const d=r.firstElementChild;if(!d||r.width===0||r.height===0)return;t.clearRect(0,0,r.width,r.height),t.drawElementImage(d,0,0);let h=r.width,p=r.height;if(i&&(h>i||p>i)){const y=Math.min(i/h,i/p);h=Math.floor(h*y),p=Math.floor(p*y)}(!n||n.width!==h||n.height!==p)&&(n=new OffscreenCanvas(h,p));const v=n.getContext("2d");if(v){if(v.clearRect(0,0,h,p),v.drawImage(r,0,0,h,p),t.clearRect(0,0,r.width,r.height),a){a(n),a=null;return}s(n)}};const c=new ResizeObserver(d=>{for(const h of d){const p=h.devicePixelContentBoxSize?.[0];if(p)r.width=p.inlineSize,r.height=p.blockSize;else{const v=h.borderBoxSize?.[0];if(v){const y=window.devicePixelRatio;r.width=Math.round(v.inlineSize*y),r.height=Math.round(v.blockSize*y)}}}r.requestPaint()});c.observe(r,{box:"device-pixel-content-box"}),ir.set(r,c);const l=r.firstElementChild;let u="";if(l){const d=new ResizeObserver(h=>{const p=h[0].borderBoxSize?.[0];if(!p)return;const v=`${Math.round(p.blockSize)}px`;v!==u&&(u=v,r.style.setProperty("height",v))});d.observe(l),or.set(r,d)}return f}function yo(r){r.onpaint=null;const e=ir.get(r);e&&(e.disconnect(),ir.delete(r));const t=or.get(r);t&&(t.disconnect(),or.delete(r))}async function bo(r,e){const t=r.getBoundingClientRect(),s=document.createElement("canvas");s.setAttribute("layoutsubtree",""),s.className=r.className;const i=r.getAttribute("style");i&&s.setAttribute("style",i),s.style.setProperty("padding","0"),s.style.setProperty("border","none"),s.style.setProperty("box-sizing","content-box"),s.style.setProperty("background","transparent");const n=getComputedStyle(r),a=n.display==="inline"?"block":n.display;s.style.setProperty("display",a);for(const u of vo)s.style.setProperty(u,n.getPropertyValue(u));for(const u of go)s.style.setProperty(u,n.getPropertyValue(u));r.style.width.endsWith("px")?s.style.setProperty("width",`${t.width}px`):s.style.setProperty("width","100%"),s.style.height||s.style.setProperty("height",`${t.height}px`);const f=window.devicePixelRatio;s.width=Math.round(t.width*f),s.height=Math.round(t.height*f),nr.set(r,r.style.margin),ar.set(r,r.style.width),fr.set(r,r.style.boxSizing),r.parentNode?.insertBefore(s,r),s.appendChild(r),r.style.setProperty("margin","0"),r.style.setProperty("width","100%"),r.style.setProperty("box-sizing","border-box");const c=await mo(r);cr.set(s,c);const l=await wo(s,e);return{canvas:s,initialCapture:l}}function Lr(r,e){yo(r);const t=cr.get(r);t&&(t(),cr.delete(r)),r.parentNode?.insertBefore(e,r),r.remove();const s=nr.get(e);s!==void 0&&(e.style.margin=s,nr.delete(e));const i=ar.get(e);i!==void 0&&(e.style.width=i,ar.delete(e));const n=fr.get(e);n!==void 0&&(e.style.boxSizing=n,fr.delete(e))}let At;function _o(){if(At!==void 0)return At;try{const r=document.createElement("canvas"),e=r.getContext("2d");At=e!==null&&typeof e.drawElementImage=="function"&&typeof r.requestPaint=="function"}catch{At=!1}return At}function xo(r){const e=typeof window<"u"?window.devicePixelRatio:1;let t;r.scrollPadding===void 0?t=[.1,.1]:r.scrollPadding===!1?t=[0,0]:Array.isArray(r.scrollPadding)?t=[r.scrollPadding[0]??.1,r.scrollPadding[1]??.1]:t=[r.scrollPadding,r.scrollPadding];let s;return r.postEffect===void 0?s=[]:Array.isArray(r.postEffect)?s=r.postEffect:s=[r.postEffect],{pixelRatio:r.pixelRatio??e,zIndex:r.zIndex??void 0,autoplay:r.autoplay??!0,fixedCanvas:r.scrollPadding===!1,scrollPadding:t,wrapper:r.wrapper,postEffects:s}}var ft=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},we=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},vt,us,Et,Vt,ct,lr,ai,Wr;class j{constructor(e,t,s){vt.add(this),this.wrapS="clamp",this.wrapT="clamp",this.minFilter="linear",this.magFilter="linear",this.needsUpdate=!0,this.source=null,us.set(this,void 0),Et.set(this,!1),Vt.set(this,void 0),ct.set(this,void 0),ft(this,us,e,"f"),this.gl=e.gl;const i=s?.externalHandle;ft(this,ct,i!==void 0,"f"),i!==void 0?(this.texture=i,ft(this,Et,!0,"f"),this.needsUpdate=!1):we(this,vt,"m",lr).call(this),t&&(this.source=t),ft(this,Vt,s?.autoRegister!==!1&&!we(this,ct,"f"),"f"),we(this,Vt,"f")&&e.addResource(this)}restore(){we(this,ct,"f")||(we(this,vt,"m",lr).call(this),ft(this,Et,!1,"f"),this.needsUpdate=!0)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture),this.needsUpdate&&(we(this,vt,"m",ai).call(this),this.needsUpdate=!1)}dispose(){we(this,Vt,"f")&&we(this,us,"f").removeResource(this),we(this,ct,"f")||this.gl.deleteTexture(this.texture)}}us=new WeakMap,Et=new WeakMap,Vt=new WeakMap,ct=new WeakMap,vt=new WeakSet,lr=function(){const e=this.gl.createTexture();if(!e)throw new Error("[VFX-JS] Failed to create texture");this.texture=e},ai=function(){const e=this.gl,t=this.source;if(e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_ALIGNMENT,4),t)try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t)}catch(s){console.error(s)}else if(!we(this,Et,"f")){const s=new Uint8Array([0,0,0,0]);e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,s)}we(this,vt,"m",Wr).call(this),ft(this,Et,!0,"f")},Wr=function(){const e=this.gl;e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,Or(e,this.wrapS)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,Or(e,this.wrapT)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,Xr(e,this.minFilter)),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,Xr(e,this.magFilter))};function Or(r,e){return e==="repeat"?r.REPEAT:e==="mirror"?r.MIRRORED_REPEAT:r.CLAMP_TO_EDGE}function Xr(r,e){return e==="nearest"?r.NEAREST:r.LINEAR}function hr(r){return new Promise((e,t)=>{const s=new Image;s.crossOrigin="anonymous",s.onload=()=>e(s),s.onerror=t,s.src=r})}var Eo=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},kt=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},It,Kt,ds;class ss{constructor(e,t,s,i={}){It.add(this),Kt.set(this,void 0),Eo(this,Kt,e,"f"),this.gl=e.gl,this.width=Math.max(1,Math.floor(t)),this.height=Math.max(1,Math.floor(s)),this.float=i.float??!1,this.mipmap=i.mipmap??!1,this.texture=new j(e,void 0,{autoRegister:!1});const n=i.wrap;n!==void 0&&(typeof n=="string"?(this.texture.wrapS=n,this.texture.wrapT=n):(this.texture.wrapS=n[0],this.texture.wrapT=n[1])),i.filter!==void 0&&(this.texture.minFilter=i.filter,this.texture.magFilter=i.filter),kt(this,It,"m",ds).call(this),e.addResource(this)}setSize(e,t){const s=Math.max(1,Math.floor(e)),i=Math.max(1,Math.floor(t));s===this.width&&i===this.height||(this.width=s,this.height=i,kt(this,It,"m",ds).call(this))}restore(){this.texture.restore(),kt(this,It,"m",ds).call(this)}dispose(){kt(this,Kt,"f").removeResource(this),this.gl.deleteFramebuffer(this.fbo),this.texture.dispose()}generateMipmaps(){if(!this.mipmap)return;const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texture.texture),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null)}}Kt=new WeakMap,It=new WeakSet,ds=function(){const e=this.gl,t=this.fbo,s=e.createFramebuffer();if(!s)throw new Error("[VFX-JS] Failed to create framebuffer");this.fbo=s;const i=this.texture.texture;e.bindTexture(e.TEXTURE_2D,i);const n=kt(this,Kt,"f").floatLinearFilter,a=this.float?n?e.RGBA32F:e.RGBA16F:e.RGBA8,f=this.float?n?e.FLOAT:e.HALF_FLOAT:e.UNSIGNED_BYTE;if(this.mipmap){const p=Math.floor(Math.log2(Math.max(this.width,this.height)))+1;let v=this.width,y=this.height;for(let P=0;P<p;P++)e.texImage2D(e.TEXTURE_2D,P,a,v,y,0,e.RGBA,f,null),v=Math.max(1,v>>1),y=Math.max(1,y>>1)}else e.texImage2D(e.TEXTURE_2D,0,a,this.width,this.height,0,e.RGBA,f,null);const c=this.texture.minFilter==="nearest"?e.NEAREST:e.LINEAR,l=this.texture.magFilter==="nearest"?e.NEAREST:e.LINEAR,u=this.mipmap?this.texture.minFilter==="nearest"?e.NEAREST_MIPMAP_NEAREST:e.LINEAR_MIPMAP_LINEAR:c,d=Dr(e,this.texture.wrapS),h=Dr(e,this.texture.wrapT);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,l),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,d),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,h),e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),this.texture.needsUpdate=!1,this.texture.source=null,t&&e.deleteFramebuffer(t)};function Dr(r,e){return e==="repeat"?r.REPEAT:e==="mirror"?r.MIRRORED_REPEAT:r.CLAMP_TO_EDGE}function ur(r,e,t,s){return{x:r.left+t,y:e-s-r.bottom,w:r.right-r.left,h:r.bottom-r.top}}function Tt(r,e,t,s){return{x:r,y:e,w:t,h:s}}var $e=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},ne=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},lt,ht,Ut,ue;class rs{constructor(e,t,s,i,n,a={}){lt.set(this,void 0),ht.set(this,void 0),Ut.set(this,void 0),ue.set(this,void 0),$e(this,lt,t,"f"),$e(this,ht,s,"f"),$e(this,Ut,i,"f");const f=t*i,c=s*i,l={float:n,wrap:a.wrap,filter:a.filter,mipmap:a.mipmap};$e(this,ue,[new ss(e,f,c,l),new ss(e,f,c,l)],"f")}get texture(){return ne(this,ue,"f")[0].texture}get target(){return ne(this,ue,"f")[1]}resize(e,t){if(e===ne(this,lt,"f")&&t===ne(this,ht,"f"))return;$e(this,lt,e,"f"),$e(this,ht,t,"f");const s=e*ne(this,Ut,"f"),i=t*ne(this,Ut,"f");ne(this,ue,"f")[0].setSize(s,i),ne(this,ue,"f")[1].setSize(s,i)}swap(){$e(this,ue,[ne(this,ue,"f")[1],ne(this,ue,"f")[0]],"f")}getViewport(){return Tt(0,0,ne(this,lt,"f"),ne(this,ht,"f"))}dispose(){ne(this,ue,"f")[0].dispose(),ne(this,ue,"f")[1].dispose()}}lt=new WeakMap,ht=new WeakMap,Ut=new WeakMap,ue=new WeakMap;class ke{constructor(e=0,t=0){this.x=0,this.y=0,this.x=e,this.y=t}set(e,t){return this.x=e,this.y=t,this}}class is{constructor(e=0,t=0,s=0,i=0){this.x=0,this.y=0,this.z=0,this.w=0,this.x=e,this.y=t,this.z=s,this.w=i}set(e,t,s,i){return this.x=e,this.y=t,this.z=s,this.w=i,this}}var cs=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},ye=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},ps,ms,ks,Is,Qt,Pt,dr;function fi(r){return/#version\s+300\s+es\b/.test(r)?"300 es":/#version\s+100\b/.test(r)||/\bgl_FragColor\b|\btexture2D\b|\bvarying\b|\battribute\b/.test(r)?"100":"300 es"}class ci{constructor(e,t,s,i){ps.add(this),ms.set(this,void 0),ks.set(this,void 0),Is.set(this,void 0),Qt.set(this,void 0),Pt.set(this,new Map),cs(this,ms,e,"f"),this.gl=e.gl,cs(this,ks,t,"f"),cs(this,Is,s,"f"),cs(this,Qt,i??fi(s),"f"),ye(this,ps,"m",dr).call(this),e.addResource(this)}restore(){ye(this,ps,"m",dr).call(this)}use(){this.gl.useProgram(this.program)}hasUniform(e){return ye(this,Pt,"f").has(e)}uploadUniforms(e){const t=this.gl;let s=0;for(const[i,n]of ye(this,Pt,"f")){const a=e[i];if(!a)continue;const f=a.value;if(f!=null){if(To(n.type)){f instanceof j&&(f.bind(s),t.uniform1i(n.location,s),s++);continue}f instanceof j||Po(t,n,f)}}}dispose(){ye(this,ms,"f").removeResource(this),this.gl.deleteProgram(this.program)}}ms=new WeakMap,ks=new WeakMap,Is=new WeakMap,Qt=new WeakMap,Pt=new WeakMap,ps=new WeakSet,dr=function(){const e=this.gl,t=Hr(e,e.VERTEX_SHADER,Nr(ye(this,ks,"f"),ye(this,Qt,"f"))),s=Hr(e,e.FRAGMENT_SHADER,Nr(ye(this,Is,"f"),ye(this,Qt,"f"))),i=e.createProgram();if(!i)throw new Error("[VFX-JS] Failed to create program");if(e.attachShader(i,t),e.attachShader(i,s),e.bindAttribLocation(i,0,"position"),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)){const a=e.getProgramInfoLog(i)??"";throw e.deleteShader(t),e.deleteShader(s),e.deleteProgram(i),new Error(`[VFX-JS] Program link failed: ${a}`)}e.detachShader(i,t),e.detachShader(i,s),e.deleteShader(t),e.deleteShader(s),this.program=i,ye(this,Pt,"f").clear();const n=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let a=0;a<n;a++){const f=e.getActiveUniform(i,a);if(!f)continue;const c=f.name.replace(/\[0\]$/,""),l=e.getUniformLocation(i,f.name);l&&ye(this,Pt,"f").set(c,{location:l,type:f.type,size:f.size})}};function Hr(r,e,t){const s=r.createShader(e);if(!s)throw new Error("[VFX-JS] Failed to create shader");if(r.shaderSource(s,t),r.compileShader(s),!r.getShaderParameter(s,r.COMPILE_STATUS)){const i=r.getShaderInfoLog(s)??"";throw r.deleteShader(s),new Error(`[VFX-JS] Shader compile failed: ${i}

${t}`)}return s}function Nr(r,e){return r.replace(/^\s+/,"").startsWith("#version")||e==="100"?r:`#version 300 es
${r}`}function To(r){return r===35678||r===36298||r===36306||r===35682}const Gr=new Set;function Po(r,e,t){const s=e.location,i=e.size>1,n=t,a=t,f=t;switch(e.type){case r.FLOAT:i?r.uniform1fv(s,n):r.uniform1f(s,t);return;case r.FLOAT_VEC2:if(i)r.uniform2fv(s,n);else if(t instanceof ke)r.uniform2f(s,t.x,t.y);else{const c=t;r.uniform2f(s,c[0],c[1])}return;case r.FLOAT_VEC3:if(i)r.uniform3fv(s,n);else{const c=t;r.uniform3f(s,c[0],c[1],c[2])}return;case r.FLOAT_VEC4:if(i)r.uniform4fv(s,n);else if(t instanceof is)r.uniform4f(s,t.x,t.y,t.z,t.w);else{const c=t;r.uniform4f(s,c[0],c[1],c[2],c[3])}return;case r.INT:i?r.uniform1iv(s,a):r.uniform1i(s,t);return;case r.INT_VEC2:if(i)r.uniform2iv(s,a);else{const c=t;r.uniform2i(s,c[0],c[1])}return;case r.INT_VEC3:if(i)r.uniform3iv(s,a);else{const c=t;r.uniform3i(s,c[0],c[1],c[2])}return;case r.INT_VEC4:if(i)r.uniform4iv(s,a);else{const c=t;r.uniform4i(s,c[0],c[1],c[2],c[3])}return;case r.BOOL:i?r.uniform1iv(s,a):r.uniform1i(s,t?1:0);return;case r.BOOL_VEC2:if(i)r.uniform2iv(s,a);else{const c=t;r.uniform2i(s,c[0]?1:0,c[1]?1:0)}return;case r.BOOL_VEC3:if(i)r.uniform3iv(s,a);else{const c=t;r.uniform3i(s,c[0]?1:0,c[1]?1:0,c[2]?1:0)}return;case r.BOOL_VEC4:if(i)r.uniform4iv(s,a);else{const c=t;r.uniform4i(s,c[0]?1:0,c[1]?1:0,c[2]?1:0,c[3]?1:0)}return;case r.FLOAT_MAT2:r.uniformMatrix2fv(s,!1,n);return;case r.FLOAT_MAT3:r.uniformMatrix3fv(s,!1,n);return;case r.FLOAT_MAT4:r.uniformMatrix4fv(s,!1,n);return;case r.UNSIGNED_INT:i?r.uniform1uiv(s,f):r.uniform1ui(s,t);return;case r.UNSIGNED_INT_VEC2:if(i)r.uniform2uiv(s,f);else{const c=t;r.uniform2ui(s,c[0],c[1])}return;case r.UNSIGNED_INT_VEC3:if(i)r.uniform3uiv(s,f);else{const c=t;r.uniform3ui(s,c[0],c[1],c[2])}return;case r.UNSIGNED_INT_VEC4:if(i)r.uniform4uiv(s,f);else{const c=t;r.uniform4ui(s,c[0],c[1],c[2],c[3])}return;default:Gr.has(e.type)||(Gr.add(e.type),console.warn(`[VFX-JS] Unsupported uniform type 0x${e.type.toString(16)}; skipping upload.`));return}}class li{constructor(e,t,s,i,n,a){this.gl=e.gl,this.program=new ci(e,t,s,a),this.uniforms=i,this.blend=n}dispose(){this.program.dispose()}}function Fo(r,e,t,s,i,n,a,f){const c=s?s.width/f:n,l=s?s.height/f:a,u=Math.max(0,i.x),d=Math.max(0,i.y),h=Math.min(c,i.x+i.w),p=Math.min(l,i.y+i.h),v=h-u,y=p-d;v<=0||y<=0||(r.bindFramebuffer(r.FRAMEBUFFER,s?s.fbo:null),r.viewport(Math.round(u*f),Math.round(d*f),Math.round(v*f),Math.round(y*f)),hi(r,t.blend),t.program.use(),t.program.uploadUniforms(t.uniforms),e.draw())}function hi(r,e){if(e==="none"){r.disable(r.BLEND);return}r.enable(r.BLEND),r.blendEquation(r.FUNC_ADD),e==="premultiplied"?r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA):e==="additive"?r.blendFuncSeparate(r.ONE,r.ONE,r.ONE,r.ONE):r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA)}class So{constructor(e){this.uniforms={src:{value:null},offset:{value:new ke},resolution:{value:new ke},viewport:{value:new is}},this.pass=new li(e,oi,ni,this.uniforms,"premultiplied")}setUniforms(e,t,s){this.uniforms.src.value=e,this.uniforms.resolution.value.set(s.w*t,s.h*t),this.uniforms.offset.value.set(s.x*t,s.y*t)}dispose(){this.pass.dispose()}}const Co=r=>{const e=document.implementation.createHTMLDocument("test"),t=e.createRange();t.selectNodeContents(e.documentElement),t.deleteContents();const s=document.createElement("head");return e.documentElement.appendChild(s),e.documentElement.appendChild(t.createContextualFragment(r)),e.documentElement.setAttribute("xmlns",e.documentElement.namespaceURI),new XMLSerializer().serializeToString(e).replace(/<!DOCTYPE html>/,"")};async function pr(r,e,t,s){const i=r.getBoundingClientRect(),n=window.devicePixelRatio,a=Math.ceil(i.width),f=Math.ceil(i.height),c=a*n,l=f*n;let u=1,d=c,h=l;s&&(d>s||h>s)&&(u=Math.min(s/d,s/h),d=Math.floor(d*u),h=Math.floor(h*u));const p=t&&t.width===d&&t.height===h?t:new OffscreenCanvas(d,h),v=r.cloneNode(!0);await ui(r,v),di(r,v),v.style.setProperty("opacity",e.toString()),v.style.setProperty("margin","0px"),Ro(v),v.style.setProperty("box-sizing","border-box"),v.style.setProperty("width",`${a}px`),v.style.setProperty("height",`${f}px`);const y=v.outerHTML,P=Co(y),M=`<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${l}"><foreignObject width="100%" height="100%">${P}</foreignObject></svg>`;return new Promise((w,_)=>{const b=new Image;b.onload=()=>{const T=p.getContext("2d");if(T===null)return _();T.clearRect(0,0,d,h);const W=n*u;T.scale(W,W),T.drawImage(b,0,0,c,l),T.setTransform(1,0,0,1,0,0),w(p)},b.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(M)}`})}async function ui(r,e){const t=window.getComputedStyle(r);for(const s of Array.from(t))/(-inline-|-block-|^inline-|^block-)/.test(s)||/^-webkit-.*(start|end|before|after|logical)/.test(s)||e.style.setProperty(s,t.getPropertyValue(s),t.getPropertyPriority(s));if(e.tagName==="INPUT")e.setAttribute("value",e.value);else if(e.tagName==="TEXTAREA")e.innerHTML=e.value;else if(e.tagName==="IMG")try{e.src=await Mo(r.src)}catch{}for(let s=0;s<r.children.length;s++){const i=r.children[s],n=e.children[s];await ui(i,n)}}function di(r,e){if(typeof r.computedStyleMap=="function")try{const t=r.computedStyleMap();for(const s of["margin-top","margin-right","margin-bottom","margin-left"]){const i=t.get(s);i instanceof CSSKeywordValue&&i.value==="auto"&&e.style.setProperty(s,"auto")}}catch{}for(let t=0;t<r.children.length;t++){const s=r.children[t],i=e.children[t];s instanceof HTMLElement&&i instanceof HTMLElement&&di(s,i)}}function Ro(r){let e=r;for(;;){const t=e.style;if(Number.parseFloat(t.paddingTop)>0||Number.parseFloat(t.borderTopWidth)>0||t.getPropertyValue("overflow-x")&&t.getPropertyValue("overflow-x")!=="visible"||t.getPropertyValue("overflow-y")&&t.getPropertyValue("overflow-y")!=="visible"||t.display==="flex"||t.display==="grid"||t.display==="flow-root"||t.display==="inline-block")break;const s=e.firstElementChild;if(!s)break;s.style.setProperty("margin-top","0px"),e=s}for(e=r;;){const t=e.style;if(Number.parseFloat(t.paddingBottom)>0||Number.parseFloat(t.borderBottomWidth)>0||t.getPropertyValue("overflow-x")&&t.getPropertyValue("overflow-x")!=="visible"||t.getPropertyValue("overflow-y")&&t.getPropertyValue("overflow-y")!=="visible"||t.display==="flex"||t.display==="grid"||t.display==="flow-root"||t.display==="inline-block")break;const s=e.lastElementChild;if(!s)break;s.style.setProperty("margin-bottom","0px"),e=s}}async function Mo(r){const e=await fetch(r).then(t=>t.blob());return new Promise(t=>{const s=new FileReader;s.onload=function(){t(this.result)},s.readAsDataURL(e)})}var pe=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},J=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},vs,gs,gt,Us,wt,Xe,zt,mr,ws,ys,bs,Bt;const Pr=Object.freeze({__brand:"EffectQuad"});function Ao(r){return r===Pr}function Vo(r,e){switch(e){case"lines":return r.LINES;case"lineStrip":return r.LINE_STRIP;case"points":return r.POINTS;default:return r.TRIANGLES}}function ko(r,e){if(e instanceof Float32Array)return r.FLOAT;if(e instanceof Uint8Array)return r.UNSIGNED_BYTE;if(e instanceof Uint16Array)return r.UNSIGNED_SHORT;if(e instanceof Uint32Array)return r.UNSIGNED_INT;if(e instanceof Int8Array)return r.BYTE;if(e instanceof Int16Array)return r.SHORT;if(e instanceof Int32Array)return r.INT;throw new Error("[VFX-JS] Unsupported attribute typed array")}function Io(r,e){if(ArrayBuffer.isView(e)&&!(e instanceof DataView))return{name:r,data:e,itemSize:2,normalized:!1,perInstance:!1};const t=e;return{name:r,data:t.data,itemSize:t.itemSize,normalized:t.normalized??!1,perInstance:t.perInstance??!1}}class Uo{constructor(e,t,s){vs.add(this),gs.set(this,void 0),gt.set(this,void 0),Us.set(this,void 0),wt.set(this,[]),Xe.set(this,null),this.indexType=0,this.hasIndices=!1,this.drawCount=0,this.drawStart=0,zt.set(this,!1),pe(this,gs,e,"f"),this.gl=e.gl,pe(this,gt,t,"f"),pe(this,Us,s,"f"),this.mode=Vo(this.gl,t.mode),this.instanceCount=t.instanceCount??0,J(this,vs,"m",mr).call(this),e.addResource(this),pe(this,zt,!0,"f")}restore(){pe(this,wt,[],"f"),pe(this,Xe,null,"f"),J(this,vs,"m",mr).call(this)}draw(){const e=this.gl;e.bindVertexArray(this.vao),this.hasIndices?this.instanceCount>0?e.drawElementsInstanced(this.mode,this.drawCount,this.indexType,this.drawStart*(this.indexType===e.UNSIGNED_INT?4:2),this.instanceCount):e.drawElements(this.mode,this.drawCount,this.indexType,this.drawStart*(this.indexType===e.UNSIGNED_INT?4:2)):this.instanceCount>0?e.drawArraysInstanced(this.mode,this.drawStart,this.drawCount,this.instanceCount):e.drawArrays(this.mode,this.drawStart,this.drawCount)}dispose(){J(this,zt,"f")&&(J(this,gs,"f").removeResource(this),pe(this,zt,!1,"f"));const e=this.gl;e.deleteVertexArray(this.vao);for(const t of J(this,wt,"f"))e.deleteBuffer(t);J(this,Xe,"f")&&e.deleteBuffer(J(this,Xe,"f")),pe(this,wt,[],"f"),pe(this,Xe,null,"f")}}gs=new WeakMap,gt=new WeakMap,Us=new WeakMap,wt=new WeakMap,Xe=new WeakMap,zt=new WeakMap,vs=new WeakSet,mr=function(){const e=this.gl,t=e.createVertexArray();if(!t)throw new Error("[VFX-JS] Failed to create VAO");this.vao=t,e.bindVertexArray(t);const s=J(this,Us,"f").program;let i=null;for(const[l,u]of Object.entries(J(this,gt,"f").attributes)){const d=Io(l,u),h=e.getAttribLocation(s,d.name);if(h<0)continue;const p=e.createBuffer();if(!p)throw new Error(`[VFX-JS] Failed to create VBO for "${d.name}"`);J(this,wt,"f").push(p),e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,d.data,e.STATIC_DRAW);const v=ko(e,d.data);e.enableVertexAttribArray(h),v===e.FLOAT||v===e.HALF_FLOAT||d.normalized?e.vertexAttribPointer(h,d.itemSize,v,d.normalized,0,0):e.vertexAttribIPointer(h,d.itemSize,v,0,0),d.perInstance&&e.vertexAttribDivisor(h,1),l==="position"&&i===null&&(i=d.data.length/d.itemSize)}let n=0;const a=J(this,gt,"f").indices;if(a){const l=e.createBuffer();if(!l)throw new Error("[VFX-JS] Failed to create IBO");pe(this,Xe,l,"f"),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,l),e.bufferData(e.ELEMENT_ARRAY_BUFFER,a,e.STATIC_DRAW),this.hasIndices=!0,this.indexType=a instanceof Uint32Array?e.UNSIGNED_INT:e.UNSIGNED_SHORT,n=a.length}else this.hasIndices=!1;e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),J(this,Xe,"f")&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null);const f=this.hasIndices?n:i??0,c=J(this,gt,"f").drawRange;this.drawStart=c?.start??0,this.drawCount=c?.count!==void 0?c.count:Math.max(0,f-this.drawStart)};class zo{constructor(e,t){ws.set(this,void 0),ys.set(this,void 0),bs.set(this,new WeakMap),Bt.set(this,new Set),pe(this,ws,e,"f"),pe(this,ys,t,"f")}get quad(){return J(this,ys,"f")}resolve(e,t){let s=J(this,bs,"f").get(e);s||(s=new Map,J(this,bs,"f").set(e,s));let i=s.get(t);return i||(i=new Uo(J(this,ws,"f"),e,t),s.set(t,i),J(this,Bt,"f").add(i)),i}dispose(){for(const e of J(this,Bt,"f"))e.dispose();J(this,Bt,"f").clear()}}ws=new WeakMap,ys=new WeakMap,bs=new WeakMap,Bt=new WeakMap;var K=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},g=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},be,De,yt,bt,zs,Ft,Zt,Qe,Ze,Lt,_e,ut,Q,re,pi,$r,mi,es,vi,gi,_s,jr;const wi=Symbol.for("@vfx-js/effect.resolve-texture"),yi=Symbol.for("@vfx-js/effect.resolve-rt");function Bo(r){return r[wi]()}function Fr(r){return r[yi]}const Lo=`#version 300 es
precision highp float;
in vec3 position;
out vec2 uv;
out vec2 uvContent;
out vec2 uvSrc;
uniform vec4 contentRectUv;
uniform vec4 srcRectUv;
void main() {
    vec2 bufferUV = position.xy * 0.5 + 0.5;
    uv = bufferUV;
    uvContent = (bufferUV - contentRectUv.xy) / contentRectUv.zw;
    uvSrc = srcRectUv.xy + uvContent * srcRectUv.zw;
    gl_Position = vec4(position, 1.0);
}
`,Wo=`
precision highp float;
attribute vec3 position;
varying vec2 uv;
varying vec2 uvContent;
varying vec2 uvSrc;
uniform vec4 contentRectUv;
uniform vec4 srcRectUv;
void main() {
    vec2 bufferUV = position.xy * 0.5 + 0.5;
    uv = bufferUV;
    uvContent = (bufferUV - contentRectUv.xy) / contentRectUv.zw;
    uvSrc = srcRectUv.xy + uvContent * srcRectUv.zw;
    gl_Position = vec4(position, 1.0);
}
`,Oo=`#version 300 es
precision highp float;
in vec2 uv;
out vec4 outColor;
uniform sampler2D src;
void main() {
    outColor = texture(src, uv);
}
`,Xo=`
precision highp float;
varying vec2 uv;
uniform sampler2D src;
void main() {
    gl_FragColor = texture2D(src, uv);
}
`,Do=`#version 300 es
precision highp float;
in vec2 uvSrc;
out vec4 outColor;
uniform sampler2D src;
void main() {
    outColor = texture(src, uvSrc);
}
`,Ho=`
precision highp float;
varying vec2 uvSrc;
uniform sampler2D src;
void main() {
    gl_FragColor = texture2D(src, uvSrc);
}
`;class No{constructor(e,t,s,i,n,a){be.add(this),De.set(this,void 0),yt.set(this,void 0),bt.set(this,void 0),zs.set(this,void 0),Ft.set(this,void 0),Zt.set(this,[]),Qe.set(this,[]),Ze.set(this,[]),Lt.set(this,[]),_e.set(this,"init"),ut.set(this,!1),Q.set(this,void 0),re.set(this,void 0),es.set(this,[]),K(this,De,e,"f"),K(this,yt,e.gl,"f"),K(this,bt,s,"f"),K(this,zs,a,"f"),K(this,Ft,new zo(e,t),"f"),K(this,Q,{outputBufferW:1,outputBufferH:1,canvasBufferSize:[1,1],outputViewport:{x:0,y:0,w:1,h:1},elementBufferW:1,elementBufferH:1,contentRectUv:[0,0,1,1],srcRectUv:[0,0,1,1]},"f");const c={time:0,deltaTime:0,pixelRatio:s,resolution:[1,1],mouse:[0,0],mouseViewport:[0,0],intersection:0,enterTime:0,leaveTime:0,src:i,target:null,uniforms:{},vfxProps:n,dims:{element:[1,1],elementPixel:[1,1],canvas:[1,1],canvasPixel:[1,1],pixelRatio:s,contentRect:[0,0,1,1],srcRect:[0,0,1,1],canvasRect:[0,0,1,1]},quad:Pr,gl:g(this,yt,"f"),createRenderTarget:l=>g(this,be,"m",pi).call(this,l),wrapTexture:(l,u)=>g(this,be,"m",mi).call(this,l,u),draw:l=>g(this,be,"m",vi).call(this,l),blit:(l,u,d)=>g(this,be,"m",gi).call(this,l,u,d),onContextRestored:l=>{const u=g(this,De,"f").onContextRestored(l);return g(this,Lt,"f").push(u),u}};K(this,re,c,"f")}get ctx(){return g(this,re,"f")}setPhase(e){K(this,_e,e,"f")}setFrameDims(e){K(this,Q,e,"f"),g(this,re,"f").resolution=[e.canvasBufferSize[0],e.canvasBufferSize[1]];for(const t of g(this,Ze,"f"))t.resolver.resize?.(e.outputBufferW,e.outputBufferH)}setEffectDims(e){g(this,re,"f").dims=e}setFrameState(e){const t=g(this,re,"f");t.time=e.time,t.deltaTime=e.deltaTime,t.mouse=e.mouse,t.mouseViewport=e.mouseViewport,t.intersection=e.intersection,t.enterTime=e.enterTime,t.leaveTime=e.leaveTime,t.uniforms=e.uniforms}setSrc(e){g(this,re,"f").src=e}setOutput(e){g(this,re,"f").target=e}passthroughCopy(e,t,s){const i=g(this,_e,"f");K(this,_e,"render","f");const n=g(this,re,"f").target;g(this,re,"f").target=t;try{const a=g(this,Q,"f").outputViewport;g(this,Q,"f").outputViewport={...s};const c=g(this,re,"f").vfxProps.glslVersion==="100"?Xo:Oo;g(this,be,"m",_s).call(this,{frag:c,uniforms:{src:e},target:t}),g(this,Q,"f").outputViewport=a}finally{g(this,re,"f").target=n,K(this,_e,i,"f")}}clearRt(e){const t=g(this,yt,"f"),s=Fr(e);t.bindFramebuffer(t.FRAMEBUFFER,s.getWriteFbo().fbo),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.disable(t.SCISSOR_TEST),t.clear(t.COLOR_BUFFER_BIT),t.bindFramebuffer(t.FRAMEBUFFER,null)}tickAutoUpdates(){for(const e of g(this,es,"f"))e()}dispose(){K(this,_e,"disposed","f");for(const e of g(this,Lt,"f"))e();K(this,Lt,[],"f");for(const e of g(this,Qe,"f"))e.resolver.dispose?.();K(this,Qe,[],"f"),K(this,Ze,[],"f");for(const e of g(this,Zt,"f"))e.dispose();K(this,Zt,[],"f"),g(this,Ft,"f").dispose(),K(this,es,[],"f")}}De=new WeakMap,yt=new WeakMap,bt=new WeakMap,zs=new WeakMap,Ft=new WeakMap,Zt=new WeakMap,Qe=new WeakMap,Ze=new WeakMap,Lt=new WeakMap,_e=new WeakMap,ut=new WeakMap,Q=new WeakMap,re=new WeakMap,es=new WeakMap,be=new WeakSet,pi=function(e){const t=e?.persistent??!1,s=e?.float??!1,i=qr(e?.wrap),n=e?.filter,a=e?.mipmap??!1,f=a!==!1,c=a===!0,l=e?.size,u=l?l[0]:g(this,Q,"f").outputBufferW,d=l?l[1]:g(this,Q,"f").outputBufferH;let h,p,v;if(t){const w=l?1:g(this,bt,"f"),_=l?u:u/w,b=l?d:d/w,T=new rs(g(this,De,"f"),_,b,w,s,{wrap:i,filter:n,mipmap:f});h={getReadTexture:()=>T.texture,getWriteFbo:()=>T.target,swap:()=>T.swap(),resize:l?void 0:(W,k)=>{T.resize(W/g(this,bt,"f"),k/g(this,bt,"f"))},dispose:()=>T.dispose()},f&&(h.regenerateMipmaps=()=>T.target.generateMipmaps(),h.mipmapAutoRegen=c),p=()=>T.target.width,v=()=>T.target.height}else{const w=new ss(g(this,De,"f"),u,d,{float:s,wrap:i,filter:n,mipmap:f});h={getReadTexture:()=>w.texture,getWriteFbo:()=>w,resize:l?void 0:(_,b)=>w.setSize(_,b),dispose:()=>w.dispose()},f&&(h.regenerateMipmaps=()=>w.generateMipmaps(),h.mipmapAutoRegen=c),p=()=>w.width,v=()=>w.height}let y;const M=bi(h,p,v,()=>g(this,be,"m",$r).call(this,y));return y={handle:M,resolver:h},g(this,Qe,"f").push(y),l||g(this,Ze,"f").push(y),M},$r=function(e){const t=g(this,Qe,"f").indexOf(e);if(t<0)return;g(this,Qe,"f").splice(t,1);const s=g(this,Ze,"f").indexOf(e);s>=0&&g(this,Ze,"f").splice(s,1),e.resolver.dispose?.()},mi=function(e,t){const s=qr(t?.wrap),i=t?.filter;let n,a,f,c=null;if(Go(e)){if(!t?.size)throw new Error("[VFX-JS] wrapTexture(WebGLTexture) requires opts.size");const[u,d]=t.size;n=new j(g(this,De,"f"),void 0,{autoRegister:!1,externalHandle:e}),a=()=>u,f=()=>d}else{const u=e;n=new j(g(this,De,"f"),u);const d=t?.size,h=y=>{if(d)return y==="w"?d[0]:d[1];if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement)return y==="w"?u.naturalWidth:u.naturalHeight;if(typeof HTMLVideoElement<"u"&&u instanceof HTMLVideoElement)return y==="w"?u.videoWidth:u.videoHeight;const P=u;return y==="w"?P.width:P.height};a=()=>h("w"),f=()=>h("h");const p=typeof HTMLVideoElement<"u"&&u instanceof HTMLVideoElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&u instanceof OffscreenCanvas;(t?.autoUpdate??p)&&(c=()=>{n.needsUpdate=!0})}return n.wrapS=s[0],n.wrapT=s[1],i!==void 0&&(n.minFilter=i,n.magFilter=i),g(this,Zt,"f").push(n),c&&g(this,es,"f").push(c),Bs(()=>n,a,f)},vi=function(e){if(g(this,_e,"f")!=="render"){g(this,_e,"f")==="update"&&!g(this,ut,"f")&&(K(this,ut,!0,"f"),console.warn("[VFX-JS] ctx.draw() called in update(); ignored. Move draws to render()."));return}g(this,be,"m",_s).call(this,e)},gi=function(e,t,s){if(g(this,_e,"f")!=="render"){g(this,_e,"f")==="update"&&!g(this,ut,"f")&&(K(this,ut,!0,"f"),console.warn("[VFX-JS] ctx.blit() called in update(); ignored. Move draws to render()."));return}const i=g(this,re,"f").vfxProps.glslVersion==="100"?Ho:Do;g(this,be,"m",_s).call(this,{frag:i,uniforms:{src:e},target:t,blend:s?.blend,swap:s?.swap})},_s=function(e){const t=g(this,yt,"f"),s=e.vert??(g(this,re,"f").vfxProps.glslVersion==="100"?Wo:Lo),i=g(this,zs,"f").get(s,e.frag,g(this,re,"f").vfxProps.glslVersion),n=g(this,re,"f").target,a=e.target===void 0||e.target===null?n:e.target,f=a===null||a===n;let c,l,u,d,h,p,v;if(a===null)c=null,l=g(this,Q,"f").outputViewport.x,u=g(this,Q,"f").outputViewport.y,d=g(this,Q,"f").outputViewport.w,h=g(this,Q,"f").outputViewport.h;else{const w=Fr(a);c=w.getWriteFbo().fbo,f?(l=g(this,Q,"f").outputViewport.x,u=g(this,Q,"f").outputViewport.y,d=g(this,Q,"f").outputViewport.w,h=g(this,Q,"f").outputViewport.h):(l=0,u=0,d=a.width,h=a.height),p=w.swap,w.mipmapAutoRegen&&(v=w.regenerateMipmaps)}t.bindFramebuffer(t.FRAMEBUFFER,c),t.viewport(l,u,d,h),t.disable(t.SCISSOR_TEST);const y=e.blend??(a===null?"premultiplied":"none");hi(t,y),i.use();const P=g(this,be,"m",jr).call(this,e.uniforms);i.uploadUniforms(P);const M=e.geometry??Pr;Ao(M)?g(this,Ft,"f").quad.draw():g(this,Ft,"f").resolve(M,i).draw(),v?.(),p&&e.swap!==!1&&p()},jr=function(e){const t={};if(t.contentRectUv={value:g(this,Q,"f").contentRectUv},t.srcRectUv={value:g(this,Q,"f").srcRectUv},!e)return t;for(const[s,i]of Object.entries(e))t[s]=$o(i);return t};function Go(r){const e=globalThis.WebGLTexture;if(e&&typeof e=="function"&&r instanceof e)return!0;const t=r;return t.width===void 0&&t.naturalWidth===void 0&&t.videoWidth===void 0}function qr(r){return r===void 0?["clamp","clamp"]:typeof r=="string"?[r,r]:[r[0],r[1]]}function $o(r){return typeof r=="object"&&r!==null&&"__brand"in r?r.__brand==="EffectRenderTarget"?{value:Fr(r).getReadTexture()}:{value:Bo(r)}:{value:r}}function Bs(r,e,t){const s={__brand:"EffectTexture",get width(){return e()},get height(){return t()}};return Object.defineProperty(s,wi,{value:r}),s}function bi(r,e,t,s){const i={__brand:"EffectRenderTarget",get width(){return e()},get height(){return t()},dispose:s??(()=>{}),generateMipmaps:()=>r.regenerateMipmaps?.()};return Object.defineProperty(i,yi,{value:r}),i}function _i(r){return bi({getReadTexture:()=>r.texture,getWriteFbo:()=>r},()=>r.width,()=>r.height)}function xi(r){return typeof r=="number"?{top:r,right:r,bottom:r,left:r}:Array.isArray(r)?{top:r[0],right:r[1],bottom:r[2],left:r[3]}:{top:r.top??0,right:r.right??0,bottom:r.bottom??0,left:r.left??0}}function os(r){return xi(r)}const Yr={top:0,right:0,bottom:0,left:0};function Ls(r){return xi(r)}function vr(r){return{top:r.top,right:r.right,bottom:r.bottom,left:r.left}}function gr(r){return{top:r.top,left:r.left,right:r.left+Math.ceil(r.right-r.left),bottom:r.top+Math.ceil(r.bottom-r.top)}}function wr(r,e){return{top:r.top-e.top,right:r.right+e.right,bottom:r.bottom+e.bottom,left:r.left-e.left}}function ls(r,e,t){return Math.min(Math.max(r,e),t)}function jo(r,e){const[t,s,i,n]=r,[a,f,c,l]=e;return c<=0||l<=0?[0,0,1,1]:[(t-a)/c,(s-f)/l,i/c,n/l]}function qo(r,e){const t=ls(e.left,r.left,r.right),i=(ls(e.right,r.left,r.right)-t)/(e.right-e.left),n=ls(e.top,r.top,r.bottom),f=(ls(e.bottom,r.top,r.bottom)-n)/(e.bottom-e.top);return i*f}var O=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},m=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},Y,ts,Ws,Os,Xs,Ds,ie,te,me,Ce,ve,_t,qe,dt,Oe,Hs,de,xs,Wt,yr,Ei,Jr,Zs,Ti,Kr,er,Pi;class Qr{constructor(e,t,s,i,n,a,f,c){Y.add(this),ts.set(this,void 0),Ws.set(this,void 0),Os.set(this,void 0),Xs.set(this,void 0),Ds.set(this,void 0),ie.set(this,void 0),te.set(this,void 0),me.set(this,void 0),Ce.set(this,[]),ve.set(this,[]),_t.set(this,void 0),qe.set(this,new Set),dt.set(this,!1),Oe.set(this,void 0),Hs.set(this,os(0)),de.set(this,null),O(this,ts,e,"f"),O(this,Ws,t,"f"),O(this,Os,s,"f"),O(this,Xs,n,"f"),O(this,Ds,c,"f"),O(this,ie,i,"f"),O(this,_t,a,"f"),O(this,Oe,f,"f"),O(this,te,i.map(()=>m(this,Y,"m",Wt).call(this)),"f"),i.length===0&&O(this,de,m(this,Y,"m",Wt).call(this),"f"),O(this,me,m(this,Y,"m",xs).call(this),"f")}get effects(){return m(this,ie,"f")}get hosts(){return m(this,te,"f")}get renderingIndices(){return m(this,me,"f")}get stages(){return m(this,ve,"f")}get hitTestPadBuffer(){return m(this,Hs,"f")}async initAll(){for(let e=0;e<m(this,ie,"f").length;e++){const t=m(this,ie,"f")[e],s=m(this,te,"f")[e];s.setPhase("init");try{t.init&&await t.init(s.ctx)}catch(i){console.error(`[VFX-JS] effect[${e}].init() failed:`,i);for(let n=e-1;n>=0;n--)m(this,Y,"m",yr).call(this,n),m(this,te,"f")[n].dispose();throw m(this,te,"f")[e].dispose(),i}s.setPhase("update")}}run(e){if(m(this,dt,"f")||!e.isVisible)return;O(this,me,m(this,Y,"m",xs).call(this),"f");const t=m(this,me,"f").length;for(const s of m(this,te,"f"))s.setFrameState({time:e.time,deltaTime:e.deltaTime,mouse:e.mouse,mouseViewport:e.mouseViewport,intersection:e.intersection,enterTime:e.enterTime,leaveTime:e.leaveTime,uniforms:e.resolvedUniforms});m(this,Y,"m",Ei).call(this,e);for(let s=0;s<m(this,te,"f").length;s++)m(this,te,"f")[s].setFrameDims(m(this,Y,"m",Pi).call(this,s,e)),m(this,te,"f")[s].setEffectDims(m(this,Y,"m",Ti).call(this,s,e));for(let s=0;s<m(this,ie,"f").length;s++){const i=m(this,ie,"f")[s];if(!i.update)continue;const n=m(this,te,"f")[s];n.setPhase("update");try{i.update(n.ctx)}catch(a){const f=`${s}:update`;m(this,qe,"f").has(f)||(m(this,qe,"f").add(f),console.warn(`[VFX-JS] effect[${s}].update() threw; skipping this frame's update:`,a))}}if(t===0){(m(this,de,"f")??m(this,te,"f")[0]).passthroughCopy(m(this,_t,"f"),e.finalTarget,e.elementRectOnCanvasPx);return}for(let s=0;s<t;s++){const i=m(this,me,"f")[s],n=m(this,te,"f")[i],a=m(this,ie,"f")[i];if(!a.render)continue;n.setPhase("render"),n.tickAutoUpdates();const f=s===0?m(this,_t,"f"):m(this,Ce,"f")[s-1].texHandle;n.setSrc(f);let c;s===t-1?c=e.finalTarget:(c=m(this,Ce,"f")[s].rtHandle,n.clearRt(c)),n.setOutput(c);try{a.render(n.ctx)}catch(l){const u=`${i}:render`;m(this,qe,"f").has(u)||(m(this,qe,"f").add(u),console.warn(`[VFX-JS] effect[${i}].render() threw; falling back to passthrough:`,l));const d=m(this,ve,"f")[s].outputViewport;c===null?n.passthroughCopy(f,null,d):s===t-1?n.passthroughCopy(f,c,d):n.passthroughCopy(f,c,{x:0,y:0,w:c.width,h:c.height})}n.setPhase("update")}}dispose(){if(!m(this,dt,"f")){O(this,dt,!0,"f");for(let e=m(this,ie,"f").length-1;e>=0;e--)m(this,Y,"m",yr).call(this,e),m(this,te,"f")[e].dispose();m(this,de,"f")&&(m(this,de,"f").dispose(),O(this,de,null,"f"));for(const e of m(this,Ce,"f"))e.fb.dispose();O(this,Ce,[],"f"),O(this,ve,[],"f")}}async replaceEffects(e){if(m(this,dt,"f"))throw new Error("[VFX-JS] replaceEffects on disposed chain");const t=m(this,ie,"f"),s=m(this,te,"f"),i=new Map;for(let f=0;f<t.length;f++)i.set(t[f],s[f]);const n=new Array(e.length),a=[];for(let f=0;f<e.length;f++){const c=e[f],l=i.get(c);if(l)n[f]=l,i.delete(c);else{const u=m(this,Y,"m",Wt).call(this);n[f]=u,a.push({host:u,effect:c})}}for(let f=0;f<a.length;f++){const{host:c,effect:l}=a[f];c.setPhase("init");try{l.init&&await l.init(c.ctx),c.setPhase("update")}catch(u){console.error("[VFX-JS] replaceEffects: new effect init() failed:",u);for(let d=f-1;d>=0;d--){const h=a[d];if(h.effect.dispose)try{h.effect.dispose()}catch(p){console.error("[VFX-JS] dispose during init rollback threw:",p)}h.host.dispose()}throw c.dispose(),u}}for(const[f,c]of i){if(f.dispose)try{f.dispose()}catch(l){console.error("[VFX-JS] effect.dispose() threw during replaceEffects:",l)}c.dispose()}for(const f of m(this,Ce,"f"))f.fb.dispose();O(this,Ce,[],"f"),O(this,ve,[],"f"),e.length===0&&!m(this,de,"f")?O(this,de,m(this,Y,"m",Wt).call(this),"f"):e.length>0&&m(this,de,"f")&&(m(this,de,"f").dispose(),O(this,de,null,"f")),O(this,ie,e,"f"),O(this,te,n,"f"),O(this,me,m(this,Y,"m",xs).call(this),"f"),m(this,qe,"f").clear()}}ts=new WeakMap,Ws=new WeakMap,Os=new WeakMap,Xs=new WeakMap,Ds=new WeakMap,ie=new WeakMap,te=new WeakMap,me=new WeakMap,Ce=new WeakMap,ve=new WeakMap,_t=new WeakMap,qe=new WeakMap,dt=new WeakMap,Oe=new WeakMap,Hs=new WeakMap,de=new WeakMap,Y=new WeakSet,xs=function(){return m(this,ie,"f").map((e,t)=>typeof e.render=="function"&&e.enabled!==!1?t:-1).filter(e=>e>=0)},Wt=function(){return new No(m(this,ts,"f"),m(this,Ws,"f"),m(this,Os,"f"),m(this,_t,"f"),m(this,Xs,"f"),m(this,Ds,"f"))},yr=function(e){const t=m(this,ie,"f")[e];if(t.dispose)try{t.dispose()}catch(s){console.error(`[VFX-JS] effect[${e}].dispose() threw:`,s)}},Ei=function(e){const t=m(this,me,"f").length;if(O(this,ve,new Array(t),"f"),t===0)return;const s=m(this,Oe,"f")?e.canvasBufferSize:e.elementBufferSize,i=[0,0,s[0],s[1]],n=m(this,Y,"m",er).call(this,e);let a=i;for(let d=0;d<t;d++){const h=m(this,me,"f")[d],p=m(this,ie,"f")[h],v=d===t-1,P=m(this,Y,"m",Jr).call(this,p,a,i,n,e)??a,M=[P[2],P[3]],w=jo(i,P),_=v?{x:e.elementRectOnCanvasPx.x+P[0],y:e.elementRectOnCanvasPx.y+P[1],w:M[0],h:M[1]}:{x:0,y:0,w:M[0],h:M[1]};m(this,ve,"f")[d]={dstRect:P,dstBufferSize:M,contentRectUv:w,outputViewport:_},v||m(this,Y,"m",Kr).call(this,d,M),a=P}const[f,c,l,u]=m(this,ve,"f")[t-1].dstRect;O(this,Hs,os({top:Math.max(0,c+u-s[1]),right:Math.max(0,f+l-s[0]),bottom:Math.max(0,-c),left:Math.max(0,-f)}),"f")},Jr=function(e,t,s,i,n){if(e.outputRect)return e.outputRect(m(this,Y,"m",Zs).call(this,n,s,t,i))},Zs=function(e,t,s,i){const n=e.canvasBufferSize[0]/e.canvasSize[0]||1;return{element:m(this,Oe,"f")?e.canvasSize:e.elementSize,elementPixel:m(this,Oe,"f")?e.canvasBufferSize:e.elementBufferSize,canvas:e.canvasSize,canvasPixel:e.canvasBufferSize,pixelRatio:n,contentRect:t,srcRect:s,canvasRect:i}},Ti=function(e,t){const s=m(this,Oe,"f")?t.canvasBufferSize:t.elementBufferSize,i=[0,0,s[0],s[1]],n=m(this,Y,"m",er).call(this,t),a=m(this,me,"f").indexOf(e),f=a<=0?i:m(this,ve,"f")[a-1].dstRect;return m(this,Y,"m",Zs).call(this,t,i,f,n)},Kr=function(e,t){const s=m(this,Ce,"f")[e];if(s&&s.fb.width===t[0]&&s.fb.height===t[1])return;s&&s.fb.dispose();const i=new ss(m(this,ts,"f"),t[0],t[1]),n=_i(i),a=Bs(()=>i.texture,()=>i.width,()=>i.height);m(this,Ce,"f")[e]={fb:i,rtHandle:n,texHandle:a,bufferSize:t}},er=function(e){const[t,s]=e.canvasBufferSize;if(m(this,Oe,"f"))return[0,0,t,s];const{x:i,y:n}=e.elementRectOnCanvasPx;return[-i,-n,t,s]},Pi=function(e,t){const s=m(this,me,"f").indexOf(e);let i,n,a,f,c;if(s<0)i=t.elementBufferSize[0],n=t.elementBufferSize[1],a={x:0,y:0,w:i,h:n},f=[0,0,1,1],c=[0,0,1,1];else{const l=m(this,ve,"f")[s];i=l.dstBufferSize[0],n=l.dstBufferSize[1],a=l.outputViewport,f=l.contentRectUv,c=s===0?[0,0,1,1]:m(this,ve,"f")[s-1].contentRectUv}return{outputBufferW:i,outputBufferH:n,canvasBufferSize:t.canvasBufferSize,outputViewport:a,elementBufferW:t.elementBufferSize[0],elementBufferH:t.elementBufferSize[1],contentRectUv:f,srcRectUv:c}};function Ne(r){this.data=r,this.pos=0}Ne.prototype.readByte=function(){return this.data[this.pos++]};Ne.prototype.peekByte=function(){return this.data[this.pos]};Ne.prototype.readBytes=function(r){return this.data.subarray(this.pos,this.pos+=r)};Ne.prototype.peekBytes=function(r){return this.data.subarray(this.pos,this.pos+r)};Ne.prototype.readString=function(r){for(var e="",t=0;t<r;t++)e+=String.fromCharCode(this.readByte());return e};Ne.prototype.readBitArray=function(){for(var r=[],e=this.readByte(),t=7;t>=0;t--)r.push(!!(e&1<<t));return r};Ne.prototype.readUnsigned=function(r){var e=this.readBytes(2);return r?(e[1]<<8)+e[0]:(e[0]<<8)+e[1]};function ns(r){this.stream=new Ne(r),this.output={}}ns.prototype.parse=function(r){return this.parseParts(this.output,r),this.output};ns.prototype.parseParts=function(r,e){for(var t=0;t<e.length;t++){var s=e[t];this.parsePart(r,s)}};ns.prototype.parsePart=function(r,e){var t=e.label,s;if(!(e.requires&&!e.requires(this.stream,this.output,r)))if(e.loop){for(var i=[];e.loop(this.stream);){var n={};this.parseParts(n,e.parts),i.push(n)}r[t]=i}else e.parts?(s={},this.parseParts(s,e.parts),r[t]=s):e.parser?(s=e.parser(this.stream,this.output,r),e.skip||(r[t]=s)):e.bits&&(r[t]=this.parseBits(e.bits))};function Yo(r){return r.reduce(function(e,t){return e*2+t},0)}ns.prototype.parseBits=function(r){var e={},t=this.stream.readBitArray();for(var s in r){var i=r[s];i.length?e[s]=Yo(t.slice(i.index,i.index+i.length)):e[s]=t[i.index]}return e};var X={readByte:function(){return function(r){return r.readByte()}},readBytes:function(r){return function(e){return e.readBytes(r)}},readString:function(r){return function(e){return e.readString(r)}},readUnsigned:function(r){return function(e){return e.readUnsigned(r)}},readArray:function(r,e){return function(t,s,i){for(var n=e(t,s,i),a=new Array(n),f=0;f<n;f++)a[f]=t.readBytes(r);return a}}},js={label:"blocks",parser:function(r){for(var e=[],t=0,s=0,i=r.readByte();i!==s;i=r.readByte())e.push(r.readBytes(i)),t+=i;var n=new Uint8Array(t);t=0;for(var a=0;a<e.length;a++)n.set(e[a],t),t+=e[a].length;return n}},Jo={label:"gce",requires:function(r){var e=r.peekBytes(2);return e[0]===33&&e[1]===249},parts:[{label:"codes",parser:X.readBytes(2),skip:!0},{label:"byteSize",parser:X.readByte()},{label:"extras",bits:{future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}}},{label:"delay",parser:X.readUnsigned(!0)},{label:"transparentColorIndex",parser:X.readByte()},{label:"terminator",parser:X.readByte(),skip:!0}]},Ko={label:"image",requires:function(r){var e=r.peekByte();return e===44},parts:[{label:"code",parser:X.readByte(),skip:!0},{label:"descriptor",parts:[{label:"left",parser:X.readUnsigned(!0)},{label:"top",parser:X.readUnsigned(!0)},{label:"width",parser:X.readUnsigned(!0)},{label:"height",parser:X.readUnsigned(!0)},{label:"lct",bits:{exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}}}]},{label:"lct",requires:function(r,e,t){return t.descriptor.lct.exists},parser:X.readArray(3,function(r,e,t){return Math.pow(2,t.descriptor.lct.size+1)})},{label:"data",parts:[{label:"minCodeSize",parser:X.readByte()},js]}]},Qo={label:"text",requires:function(r){var e=r.peekBytes(2);return e[0]===33&&e[1]===1},parts:[{label:"codes",parser:X.readBytes(2),skip:!0},{label:"blockSize",parser:X.readByte()},{label:"preData",parser:function(r,e,t){return r.readBytes(t.text.blockSize)}},js]},Zo={label:"application",requires:function(r,e,t){var s=r.peekBytes(2);return s[0]===33&&s[1]===255},parts:[{label:"codes",parser:X.readBytes(2),skip:!0},{label:"blockSize",parser:X.readByte()},{label:"id",parser:function(r,e,t){return r.readString(t.blockSize)}},js]},en={label:"comment",requires:function(r,e,t){var s=r.peekBytes(2);return s[0]===33&&s[1]===254},parts:[{label:"codes",parser:X.readBytes(2),skip:!0},js]},tn={label:"frames",parts:[Jo,Zo,en,Ko,Qo],loop:function(r){var e=r.peekByte();return e===33||e===44}},sn=[{label:"header",parts:[{label:"signature",parser:X.readString(3)},{label:"version",parser:X.readString(3)}]},{label:"lsd",parts:[{label:"width",parser:X.readUnsigned(!0)},{label:"height",parser:X.readUnsigned(!0)},{label:"gct",bits:{exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}}},{label:"backgroundColorIndex",parser:X.readByte()},{label:"pixelAspectRatio",parser:X.readByte()}]},{label:"gct",requires:function(r,e){return e.lsd.gct.exists},parser:X.readArray(3,function(r,e){return Math.pow(2,e.lsd.gct.size+1)})},tn];function Sr(r){var e=new Uint8Array(r),t=new ns(e);this.raw=t.parse(sn),this.raw.hasImages=!1;for(var s=0;s<this.raw.frames.length;s++)if(this.raw.frames[s].image){this.raw.hasImages=!0;break}}Sr.prototype.decompressFrame=function(r,e){if(r>=this.raw.frames.length)return null;var t=this.raw.frames[r];if(t.image){var s=t.image.descriptor.width*t.image.descriptor.height,i=a(t.image.data.minCodeSize,t.image.data.blocks,s);t.image.descriptor.lct.interlaced&&(i=f(i,t.image.descriptor.width));var n={pixels:i,dims:{top:t.image.descriptor.top,left:t.image.descriptor.left,width:t.image.descriptor.width,height:t.image.descriptor.height}};return t.image.descriptor.lct&&t.image.descriptor.lct.exists?n.colorTable=t.image.lct:n.colorTable=this.raw.gct,t.gce&&(n.delay=(t.gce.delay||10)*10,n.disposalType=t.gce.extras.disposal,t.gce.extras.transparentColorGiven&&(n.transparentIndex=t.gce.transparentColorIndex)),e&&(n.patch=c(n)),n}return null;function a(l,u,d){var h=4096,p=-1,v=d,y,P,M,w,_,b,T,W,k,z,S,x,R,I,D,Z,he=new Array(d),$=new Array(h),q=new Array(h),Re=new Array(h+1);for(x=l,P=1<<x,_=P+1,y=P+2,T=p,w=x+1,M=(1<<w)-1,k=0;k<P;k++)$[k]=0,q[k]=k;for(S=W=R=I=Z=D=0,z=0;z<v;){if(I===0){if(W<w){S+=u[D]<<W,W+=8,D++;continue}if(k=S&M,S>>=w,W-=w,k>y||k==_)break;if(k==P){w=x+1,M=(1<<w)-1,y=P+2,T=p;continue}if(T==p){Re[I++]=q[k],T=k,R=k;continue}for(b=k,k==y&&(Re[I++]=R,k=T);k>P;)Re[I++]=q[k],k=$[k];R=q[k]&255,Re[I++]=R,y<h&&($[y]=T,q[y]=R,y++,(y&M)===0&&y<h&&(w++,M+=y)),T=b}I--,he[Z++]=Re[I],z++}for(z=Z;z<v;z++)he[z]=0;return he}function f(l,u){for(var d=new Array(l.length),h=l.length/u,p=function(_,b){var T=l.slice(b*u,(b+1)*u);d.splice.apply(d,[_*u,u].concat(T))},v=[0,4,2,1],y=[8,8,4,2],P=0,M=0;M<4;M++)for(var w=v[M];w<h;w+=y[M])p(w,P),P++;return d}function c(l){for(var u=l.pixels.length,d=new Uint8ClampedArray(u*4),h=0;h<u;h++){var p=h*4,v=l.pixels[h],y=l.colorTable[v];d[p]=y[0],d[p+1]=y[1],d[p+2]=y[2],d[p+3]=v!==l.transparentIndex?255:0}return d}};Sr.prototype.decompressFrames=function(r,e,t){e===void 0&&(e=0),t===void 0?t=this.raw.frames.length:t=Math.min(t,this.raw.frames.length);for(var s=[],i=e;i<t;i++){var n=this.raw.frames[i];n.image&&s.push(this.decompressFrame(i,r))}return s};class qs{static async create(e,t){const s=await fetch(e).then(f=>f.arrayBuffer()).then(f=>new Sr(f)),i=s.decompressFrames(!0,void 0,void 0),{width:n,height:a}=s.raw.lsd;return new qs(i,n,a,t)}constructor(e,t,s,i){this.frames=[],this.index=0,this.playTime=0,this.frames=e,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.pixelRatio=i,this.canvas.width=t,this.canvas.height=s,this.startTime=Date.now()}getCanvas(){return this.canvas}update(){const t=Date.now()-this.startTime;for(;this.playTime<t;){const n=this.frames[this.index%this.frames.length];this.playTime+=n.delay,this.index++}const s=this.frames[this.index%this.frames.length],i=new ImageData(s.patch,s.dims.width,s.dims.height);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.putImageData(i,s.dims.left,s.dims.top)}}var ge=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},Ot,Xt,Dt,br,_r;class rn{constructor(e){this.isContextLost=!1,Ot.set(this,new Set),Xt.set(this,new Set),Dt.set(this,new Set),br.set(this,s=>{s.preventDefault(),this.isContextLost=!0;for(const i of ge(this,Xt,"f"))i()}),_r.set(this,()=>{this.isContextLost=!1;const s=this.gl;s.getExtension("EXT_color_buffer_float"),s.getExtension("EXT_color_buffer_half_float");for(const i of ge(this,Ot,"f"))i.restore();for(const i of ge(this,Dt,"f"))i()});const t=e.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1});if(!t)throw new Error("[VFX-JS] WebGL2 is not available.");this.gl=t,this.canvas=e,t.getExtension("EXT_color_buffer_float"),t.getExtension("EXT_color_buffer_half_float"),this.floatLinearFilter=!!t.getExtension("OES_texture_float_linear"),this.maxTextureSize=t.getParameter(t.MAX_TEXTURE_SIZE),e.addEventListener("webglcontextlost",ge(this,br,"f"),!1),e.addEventListener("webglcontextrestored",ge(this,_r,"f"),!1)}setSize(e,t,s){const i=Math.floor(e*s),n=Math.floor(t*s);(this.canvas.width!==i||this.canvas.height!==n)&&(this.canvas.width=i,this.canvas.height=n)}addResource(e){ge(this,Ot,"f").add(e)}removeResource(e){ge(this,Ot,"f").delete(e)}onContextLost(e){return ge(this,Xt,"f").add(e),()=>ge(this,Xt,"f").delete(e)}onContextRestored(e){return ge(this,Dt,"f").add(e),()=>ge(this,Dt,"f").delete(e)}}Ot=new WeakMap,Xt=new WeakMap,Dt=new WeakMap,br=new WeakMap,_r=new WeakMap;var Fi=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},hs=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},Es,Ts,Ns,xr;class on{constructor(e){Es.add(this),Ts.set(this,void 0),Ns.set(this,void 0),Fi(this,Ts,e,"f"),this.gl=e.gl,hs(this,Es,"m",xr).call(this),e.addResource(this)}restore(){hs(this,Es,"m",xr).call(this)}draw(){const e=this.gl;e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,6)}dispose(){hs(this,Ts,"f").removeResource(this),this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(hs(this,Ns,"f"))}}Ts=new WeakMap,Ns=new WeakMap,Es=new WeakSet,xr=function(){const e=this.gl,t=e.createVertexArray(),s=e.createBuffer();if(!t||!s)throw new Error("[VFX-JS] Failed to create quad VAO");this.vao=t,Fi(this,Ns,s,"f");const i=new Float32Array([-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]);e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)};function Er(r,e,t,s={}){return new ss(r,e,t,{float:s.float??!1})}function Si(r,e){const t=e.renderingToBuffer??!1;let s;t?s="none":e.premultipliedAlpha?s="premultiplied":s="normal";const i=e.glslVersion??fi(e.fragmentShader),n=e.vertexShader??(i==="100"?ho:oi);return new li(r,n,e.fragmentShader,e.uniforms,s,i)}var je=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},U=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},ee,Ht,Ae,Nt,pt,Le;class Zr{constructor(e,t,s,i,n,a,f,c){if(ee.set(this,void 0),Ht.set(this,void 0),Ae.set(this,void 0),Nt.set(this,void 0),pt.set(this,void 0),Le.set(this,void 0),je(this,Nt,i??!1,"f"),je(this,pt,n??!1,"f"),je(this,Le,a,"f"),je(this,Ht,{},"f"),je(this,ee,{src:{value:null},offset:{value:new ke},resolution:{value:new ke},viewport:{value:new is},time:{value:0},mouse:{value:new ke},passIndex:{value:0}},"f"),s)for(const[l,u]of Object.entries(s))typeof u=="function"?(U(this,Ht,"f")[l]=u,U(this,ee,"f")[l]={value:u()}):U(this,ee,"f")[l]={value:u};this.pass=Si(e,{fragmentShader:t,uniforms:U(this,ee,"f"),renderingToBuffer:f??!1,premultipliedAlpha:!0,glslVersion:c})}get uniforms(){return U(this,ee,"f")}setUniforms(e,t,s,i,n,a){U(this,ee,"f").src.value=e,U(this,ee,"f").resolution.value.set(s.w*t,s.h*t),U(this,ee,"f").offset.value.set(s.x*t,s.y*t),U(this,ee,"f").time.value=i,U(this,ee,"f").mouse.value.set(n*t,a*t)}updateCustomUniforms(e){for(const[t,s]of Object.entries(U(this,Ht,"f")))U(this,ee,"f")[t]&&(U(this,ee,"f")[t].value=s());if(e)for(const[t,s]of Object.entries(e))U(this,ee,"f")[t]&&(U(this,ee,"f")[t].value=s())}initializeBackbuffer(e,t,s,i){U(this,Nt,"f")&&!U(this,Ae,"f")&&(U(this,Le,"f")?je(this,Ae,new rs(e,U(this,Le,"f")[0],U(this,Le,"f")[1],1,U(this,pt,"f")),"f"):je(this,Ae,new rs(e,t,s,i,U(this,pt,"f")),"f"))}resizeBackbuffer(e,t){U(this,Ae,"f")&&!U(this,Le,"f")&&U(this,Ae,"f").resize(e,t)}registerBufferUniform(e){U(this,ee,"f")[e]||(U(this,ee,"f")[e]={value:null})}get backbuffer(){return U(this,Ae,"f")}get persistent(){return U(this,Nt,"f")}get float(){return U(this,pt,"f")}get size(){return U(this,Le,"f")}dispose(){this.pass.dispose(),U(this,Ae,"f")?.dispose()}}ee=new WeakMap,Ht=new WeakMap,Ae=new WeakMap,Nt=new WeakMap,pt=new WeakMap,Le=new WeakMap;var nn=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},at=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},Ps,Ye;class an{constructor(e){Ps.set(this,void 0),Ye.set(this,new Map),nn(this,Ps,e,"f")}get(e,t,s){const i=`${t}\0${e}\0${s??""}`;let n=at(this,Ye,"f").get(i);return n||(n=new ci(at(this,Ps,"f"),e,t,s),at(this,Ye,"f").set(i,n)),n}get size(){return at(this,Ye,"f").size}dispose(){for(const e of at(this,Ye,"f").values())e.dispose();at(this,Ye,"f").clear()}}Ps=new WeakMap,Ye=new WeakMap;var L=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},o=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},C,Se,Ve,V,Ke,et,St,ce,fe,G,xt,ae,tt,He,Gt,Fs,$t,We,E,se,jt,oe,qt,Je,xe,Ee,Te,Pe,Yt,Ci,Jt,Ss,Cs,Ri,Mi,Rs,Ai,Tr,tr,Ms,ei,Gs,sr,le,As,Vi,ti,ki,Ii,Ui;const $s=new Map;class fn{constructor(e,t){C.add(this),Se.set(this,void 0),Ve.set(this,void 0),V.set(this,void 0),Ke.set(this,void 0),et.set(this,void 0),St.set(this,void 0),ce.set(this,void 0),fe.set(this,[]),G.set(this,void 0),xt.set(this,new Map),ae.set(this,null),tt.set(this,!1),He.set(this,new WeakSet),Gt.set(this,{}),Fs.set(this,{}),$t.set(this,0),We.set(this,void 0),E.set(this,2),se.set(this,[]),jt.set(this,Date.now()/1e3),oe.set(this,Ls(0)),qt.set(this,Ls(0)),Je.set(this,[0,0]),xe.set(this,0),Ee.set(this,0),Te.set(this,0),Pe.set(this,0),Yt.set(this,new WeakMap),Jt.set(this,async()=>{if(typeof window<"u"){for(const s of o(this,se,"f"))if(s.type==="text"&&s.isInViewport){const i=s.element.getBoundingClientRect(),n=Math.ceil(i.width),a=Math.ceil(i.height);(n!==s.width||a!==s.height)&&(await o(this,C,"m",Cs).call(this,s),s.width=n,s.height=a)}for(const s of o(this,se,"f"))if(s.type==="text"&&!s.isInViewport){const i=s.element.getBoundingClientRect(),n=Math.ceil(i.width),a=Math.ceil(i.height);(n!==s.width||a!==s.height)&&(await o(this,C,"m",Cs).call(this,s),s.width=n,s.height=a)}}}),Ss.set(this,s=>{typeof window<"u"&&(L(this,Te,s.clientX,"f"),L(this,Pe,window.innerHeight-s.clientY,"f"))}),Rs.set(this,()=>{this.isPlaying()&&(this.render(),L(this,We,requestAnimationFrame(o(this,Rs,"f")),"f"))}),L(this,Se,e,"f"),L(this,Ve,t,"f"),L(this,V,new rn(t),"f"),L(this,Ke,o(this,V,"f").gl,"f"),o(this,Ke,"f").clearColor(0,0,0,0),L(this,E,e.pixelRatio,"f"),L(this,et,new on(o(this,V,"f")),"f"),L(this,St,new an(o(this,V,"f")),"f"),typeof window<"u"&&(window.addEventListener("resize",o(this,Jt,"f")),window.addEventListener("pointermove",o(this,Ss,"f"))),o(this,Jt,"f").call(this),L(this,ce,new So(o(this,V,"f")),"f"),o(this,C,"m",Vi).call(this,e.postEffects),o(this,V,"f").onContextRestored(()=>{o(this,Ke,"f").clearColor(0,0,0,0)})}destroy(){this.stop(),typeof window<"u"&&(window.removeEventListener("resize",o(this,Jt,"f")),window.removeEventListener("pointermove",o(this,Ss,"f"))),o(this,G,"f")?.dispose();for(const e of o(this,xt,"f").values())e?.dispose();for(const e of o(this,fe,"f"))e.pass.dispose();o(this,ae,"f")&&(o(this,ae,"f").dispose(),L(this,ae,null,"f"),L(this,tt,!1,"f")),o(this,ce,"f").dispose(),o(this,St,"f").dispose(),o(this,et,"f").dispose()}async addElement(e,t={},s){if(t.effect!==void 0)return o(this,C,"m",Ri).call(this,e,t,t.effect,s);const i=o(this,C,"m",Mi).call(this,t),n=e.getBoundingClientRect(),a=Oi(e)?gr(n):vr(n),[f,c]=Bi(t.overflow),l=wr(a,c),u=Li(t.intersection),d=e.style.opacity===""?1:Number.parseFloat(e.style.opacity);let h,p,v=!1;if(e instanceof HTMLImageElement)if(p="img",v=!!e.src.match(/\.gif/i),v){const x=await qs.create(e.src,o(this,E,"f"));$s.set(e,x),h=new j(o(this,V,"f"),x.getCanvas())}else{const x=await hr(e.src);h=new j(o(this,V,"f"),x)}else if(e instanceof HTMLVideoElement)h=new j(o(this,V,"f"),e),p="video";else if(e instanceof HTMLCanvasElement)e.hasAttribute("layoutsubtree")&&s?(h=new j(o(this,V,"f"),s),p="hic"):(h=new j(o(this,V,"f"),e),p="canvas");else{const x=await pr(e,d,void 0,this.maxTextureSize);h=new j(o(this,V,"f"),x),p="text"}const[y,P]=Wi(t.wrap);h.wrapS=y,h.wrapT=P,h.needsUpdate=!0;const M=t.autoCrop??!0;if(p!=="hic"){if(t.overlay!==!0)if(typeof t.overlay=="number")e.style.setProperty("opacity",t.overlay.toString());else{const x=p==="video"?"0.0001":"0";e.style.setProperty("opacity",x.toString())}}const w={src:{value:h},resolution:{value:new ke},offset:{value:new ke},time:{value:0},enterTime:{value:-1},leaveTime:{value:-1},mouse:{value:new ke},intersection:{value:0},viewport:{value:new is},autoCrop:{value:M}},_={};if(t.uniforms!==void 0)for(const[x,R]of Object.entries(t.uniforms))typeof R=="function"?(w[x]={value:R()},_[x]=R):w[x]={value:R};let b;t.backbuffer&&(b=(()=>{const x=(l.right-l.left)*o(this,E,"f"),R=(l.bottom-l.top)*o(this,E,"f");return new rs(o(this,V,"f"),x,R,o(this,E,"f"),!1)})(),w.backbuffer={value:b.texture});const T=new Map,W=new Map;for(let x=0;x<i.length-1;x++){const R=i[x].target??`pass${x}`;i[x]={...i[x],target:R};const I=i[x].size,D=I?I[0]:(l.right-l.left)*o(this,E,"f"),Z=I?I[1]:(l.bottom-l.top)*o(this,E,"f");if(i[x].persistent){const he=I?1:o(this,E,"f"),$=I?I[0]:l.right-l.left,q=I?I[1]:l.bottom-l.top;W.set(R,new rs(o(this,V,"f"),$,q,he,i[x].float))}else T.set(R,Er(o(this,V,"f"),D,Z,{float:i[x].float}))}const k=[];for(let x=0;x<i.length;x++){const R=i[x],I=R.frag,D={...w},Z={};for(const[$,q]of T)$!==R.target&&I.match(new RegExp(`uniform\\s+sampler2D\\s+${$}\\b`))&&(D[$]={value:q.texture});for(const[$,q]of W)I.match(new RegExp(`uniform\\s+sampler2D\\s+${$}\\b`))&&(D[$]={value:q.texture});if(R.uniforms)for(const[$,q]of Object.entries(R.uniforms))typeof q=="function"?(D[$]={value:q()},Z[$]=q):D[$]={value:q};const he=Si(o(this,V,"f"),{vertexShader:R.vert,fragmentShader:I,uniforms:D,renderingToBuffer:R.target!==void 0,glslVersion:R.glslVersion});k.push({pass:he,uniforms:D,uniformGenerators:{..._,...Z},target:R.target,persistent:R.persistent,float:R.float,size:R.size,backbuffer:R.target?W.get(R.target):void 0})}const z=Date.now()/1e3,S={type:p,element:e,isInViewport:!1,isInLogicalViewport:!1,width:a.right-a.left,height:a.bottom-a.top,passes:k,bufferTargets:T,startTime:z,enterTime:z,leaveTime:Number.NEGATIVE_INFINITY,release:t.release??Number.POSITIVE_INFINITY,isGif:v,isFullScreen:f,overflow:c,intersection:u,originalOpacity:d,srcTexture:h,zIndex:t.zIndex??0,backbuffer:b,autoCrop:M};o(this,C,"m",Gs).call(this,S,a,z),o(this,se,"f").push(S),o(this,se,"f").sort((x,R)=>x.zIndex-R.zIndex)}async updateElementEffects(e,t){const s=o(this,se,"f").find(l=>l.element===e);if(!s)throw new Error("[VFX-JS] updateElementEffects: element not registered");if(!s.chain)throw new Error("[VFX-JS] updateElementEffects: element is on the shader path; effect-only updates are not supported");const i=Array.isArray(t)?[...t]:[t],n=s.chain.effects,a=new Set(n),f=[];for(const l of i)if(!a.has(l)){if(o(this,He,"f").has(l))throw new Error("[VFX-JS] Effect instance already attached. Construct a new instance per `vfx.add()` / `postEffect`.");f.push(l)}await s.chain.replaceEffects(i);const c=new Set(i);for(const l of n)c.has(l)||o(this,He,"f").delete(l);for(const l of f)o(this,He,"f").add(l)}removeElement(e){const t=o(this,se,"f").findIndex(s=>s.element===e);if(t!==-1){const s=o(this,se,"f").splice(t,1)[0];if(s.chain)o(this,C,"m",Ms).call(this,s.chain.effects),s.chain.dispose();else{for(const i of s.bufferTargets.values())i.dispose();for(const i of s.passes)i.pass.dispose(),i.backbuffer?.dispose();s.backbuffer?.dispose()}s.srcTexture.dispose(),e.style.setProperty("opacity",s.originalOpacity.toString())}}updateTextElement(e){const t=o(this,se,"f").findIndex(s=>s.element===e);return t!==-1?o(this,C,"m",Cs).call(this,o(this,se,"f")[t]):Promise.resolve()}async updateImageElement(e){const t=o(this,se,"f").find(a=>a.element===e);if(!t||t.type!=="img"||t.isGif)return;const s=await hr(e.src),i=t.srcTexture,n=new j(o(this,V,"f"),s);n.wrapS=i.wrapS,n.wrapT=i.wrapT,n.needsUpdate=!0,!t.chain&&t.passes.length>0&&(t.passes[0].uniforms.src.value=n),t.srcTexture=n,i.dispose()}updateCanvasElement(e){const t=o(this,se,"f").find(s=>s.element===e);if(t){const s=t.srcTexture,i=new j(o(this,V,"f"),e);i.wrapS=s.wrapS,i.wrapT=s.wrapT,i.needsUpdate=!0,!t.chain&&t.passes.length>0&&(t.passes[0].uniforms.src.value=i),t.srcTexture=i,s.dispose()}}updateHICTexture(e,t){const s=o(this,se,"f").find(n=>n.element===e);if(!s||s.type!=="hic")return;const i=s.srcTexture;if(i.source===t)i.needsUpdate=!0;else{const n=new j(o(this,V,"f"),t);n.wrapS=i.wrapS,n.wrapT=i.wrapT,n.needsUpdate=!0,!s.chain&&s.passes.length>0&&(s.passes[0].uniforms.src.value=n),s.srcTexture=n,i.dispose()}}get maxTextureSize(){return o(this,V,"f").maxTextureSize}isPlaying(){return o(this,We,"f")!==void 0}play(){this.isPlaying()||L(this,We,requestAnimationFrame(o(this,Rs,"f")),"f")}stop(){o(this,We,"f")!==void 0&&(cancelAnimationFrame(o(this,We,"f")),L(this,We,void 0,"f"))}render(){const e=Date.now()/1e3,t=o(this,Ke,"f");o(this,C,"m",Ci).call(this),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,o(this,Ve,"f").width,o(this,Ve,"f").height),t.clear(t.COLOR_BUFFER_BIT);const s=o(this,oe,"f").right-o(this,oe,"f").left,i=o(this,oe,"f").bottom-o(this,oe,"f").top,n=Tt(0,0,s,i),a=o(this,C,"m",Tr).call(this);a&&(o(this,C,"m",Ui).call(this,s,i),o(this,G,"f")&&(t.bindFramebuffer(t.FRAMEBUFFER,o(this,G,"f").fbo),t.clear(t.COLOR_BUFFER_BIT),t.bindFramebuffer(t.FRAMEBUFFER,null)));for(const f of o(this,se,"f")){const c=f.element.getBoundingClientRect(),l=f.type==="text"?gr(c):vr(c),u=o(this,C,"m",Gs).call(this,f,l,e);if(!u.isVisible)continue;if(f.chain){o(this,C,"m",Ai).call(this,f,l,u,e);continue}const d=f.passes[0].uniforms;d.time.value=e-f.startTime,d.resolution.value.set((l.right-l.left)*o(this,E,"f"),(l.bottom-l.top)*o(this,E,"f")),d.mouse.value.set((o(this,Te,"f")+o(this,xe,"f"))*o(this,E,"f"),(o(this,Pe,"f")+o(this,Ee,"f"))*o(this,E,"f"));for(const _ of f.passes)for(const[b,T]of Object.entries(_.uniformGenerators))_.uniforms[b].value=T();$s.get(f.element)?.update(),(f.type==="video"||f.isGif)&&(d.src.value.needsUpdate=!0);const h=ur(l,i,o(this,xe,"f"),o(this,Ee,"f")),p=ur(u.rectWithOverflow,i,o(this,xe,"f"),o(this,Ee,"f"));f.backbuffer&&(f.passes[0].uniforms.backbuffer.value=f.backbuffer.texture);{const _=f.isFullScreen?n:p,b=Math.max(1,_.w*o(this,E,"f")),T=Math.max(1,_.h*o(this,E,"f")),W=Math.max(1,_.w),k=Math.max(1,_.h);for(let z=0;z<f.passes.length-1;z++){const S=f.passes[z];if(!S.size)if(S.backbuffer)S.backbuffer.resize(W,k);else{const x=f.bufferTargets.get(S.target);x&&(x.width!==b||x.height!==T)&&x.setSize(b,T)}}}const v=new Map;for(const _ of f.passes)_.backbuffer&&_.target&&v.set(_.target,_.backbuffer.texture);let y=f.srcTexture;const P=o(this,Te,"f")+o(this,xe,"f")-h.x,M=o(this,Pe,"f")+o(this,Ee,"f")-h.y;for(let _=0;_<f.passes.length-1;_++){const b=f.passes[_],T=f.isFullScreen?n:p;b.uniforms.src.value=y;for(const[S,x]of v)b.uniforms[S]&&(b.uniforms[S].value=x);for(const[S,x]of Object.entries(b.uniformGenerators))b.uniforms[S]&&(b.uniforms[S].value=x());const W=b.size?b.size[0]:T.w*o(this,E,"f"),k=b.size?b.size[1]:T.h*o(this,E,"f"),z=b.size?Tt(0,0,b.size[0],b.size[1]):Tt(0,0,T.w,T.h);if(b.uniforms.resolution.value.set(W,k),b.uniforms.offset.value.set(0,0),b.uniforms.mouse.value.set(P/T.w*W,M/T.h*k),b.backbuffer)o(this,C,"m",le).call(this,b.pass,b.backbuffer.target,z,b.uniforms,!0),b.backbuffer.swap(),y=b.backbuffer.texture;else{const S=f.bufferTargets.get(b.target);if(!S)continue;o(this,C,"m",le).call(this,b.pass,S,z,b.uniforms,!0),y=S.texture}b.target&&v.set(b.target,y)}const w=f.passes[f.passes.length-1];w.uniforms.src.value=y,w.uniforms.resolution.value.set(c.width*o(this,E,"f"),c.height*o(this,E,"f")),w.uniforms.offset.value.set(h.x*o(this,E,"f"),h.y*o(this,E,"f")),w.uniforms.mouse.value.set((o(this,Te,"f")+o(this,xe,"f"))*o(this,E,"f"),(o(this,Pe,"f")+o(this,Ee,"f"))*o(this,E,"f"));for(const[_,b]of v)w.uniforms[_]&&(w.uniforms[_].value=b);for(const[_,b]of Object.entries(w.uniformGenerators))w.uniforms[_]&&(w.uniforms[_].value=b());f.backbuffer?(w.uniforms.backbuffer.value=f.backbuffer.texture,f.isFullScreen?(f.backbuffer.resize(s,i),o(this,C,"m",As).call(this,f,h.x,h.y),o(this,C,"m",le).call(this,w.pass,f.backbuffer.target,n,w.uniforms,!0),f.backbuffer.swap(),o(this,ce,"f").setUniforms(f.backbuffer.texture,o(this,E,"f"),n),o(this,C,"m",le).call(this,o(this,ce,"f").pass,a&&o(this,G,"f")||null,n,o(this,ce,"f").uniforms,!1)):(f.backbuffer.resize(p.w,p.h),o(this,C,"m",As).call(this,f,f.overflow.left,f.overflow.bottom),o(this,C,"m",le).call(this,w.pass,f.backbuffer.target,f.backbuffer.getViewport(),w.uniforms,!0),f.backbuffer.swap(),o(this,ce,"f").setUniforms(f.backbuffer.texture,o(this,E,"f"),p),o(this,C,"m",le).call(this,o(this,ce,"f").pass,a&&o(this,G,"f")||null,p,o(this,ce,"f").uniforms,!1))):(o(this,C,"m",As).call(this,f,h.x,h.y),o(this,C,"m",le).call(this,w.pass,a&&o(this,G,"f")||null,f.isFullScreen?n:p,w.uniforms,!1))}a&&o(this,G,"f")&&(o(this,ae,"f")&&o(this,tt,"f")?o(this,C,"m",ki).call(this,n,e):o(this,C,"m",Ii).call(this,n,e))}}Se=new WeakMap,Ve=new WeakMap,V=new WeakMap,Ke=new WeakMap,et=new WeakMap,St=new WeakMap,ce=new WeakMap,fe=new WeakMap,G=new WeakMap,xt=new WeakMap,ae=new WeakMap,tt=new WeakMap,He=new WeakMap,Gt=new WeakMap,Fs=new WeakMap,$t=new WeakMap,We=new WeakMap,E=new WeakMap,se=new WeakMap,jt=new WeakMap,oe=new WeakMap,qt=new WeakMap,Je=new WeakMap,xe=new WeakMap,Ee=new WeakMap,Te=new WeakMap,Pe=new WeakMap,Yt=new WeakMap,Jt=new WeakMap,Ss=new WeakMap,Rs=new WeakMap,C=new WeakSet,Ci=function(){if(typeof window>"u")return;const e=o(this,Ve,"f").ownerDocument,t=e.compatMode==="BackCompat"?e.body:e.documentElement,s=t.clientWidth,i=t.clientHeight,n=window.scrollX,a=window.scrollY;let f,c;if(o(this,Se,"f").fixedCanvas)f=0,c=0;else if(o(this,Se,"f").wrapper)f=s*o(this,Se,"f").scrollPadding[0],c=i*o(this,Se,"f").scrollPadding[1];else{const d=e.body.scrollWidth-(n+s),h=e.body.scrollHeight-(a+i);f=ri(s*o(this,Se,"f").scrollPadding[0],0,d),c=ri(i*o(this,Se,"f").scrollPadding[1],0,h)}const l=s+f*2,u=i+c*2;(l!==o(this,Je,"f")[0]||u!==o(this,Je,"f")[1])&&(o(this,Ve,"f").style.width=`${l}px`,o(this,Ve,"f").style.height=`${u}px`,o(this,V,"f").setSize(l,u,o(this,E,"f")),L(this,oe,Ls({top:-c,left:-f,right:s+f,bottom:i+c}),"f"),L(this,qt,Ls({top:0,left:0,right:s,bottom:i}),"f"),L(this,Je,[l,u],"f"),L(this,xe,f,"f"),L(this,Ee,c,"f")),o(this,Se,"f").fixedCanvas||o(this,Ve,"f").style.setProperty("transform",`translate(${n-f}px, ${a-c}px)`)},Cs=async function(e){if(!o(this,Yt,"f").get(e.element)){o(this,Yt,"f").set(e.element,!0);try{const t=e.srcTexture,s=t.source instanceof OffscreenCanvas?t.source:void 0,i=await pr(e.element,e.originalOpacity,s,this.maxTextureSize);if(i.width===0||i.width===0)throw"omg";const n=new j(o(this,V,"f"),i);n.wrapS=t.wrapS,n.wrapT=t.wrapT,n.needsUpdate=!0,!e.chain&&e.passes.length>0&&(e.passes[0].uniforms.src.value=n),e.srcTexture=n,t.dispose()}catch(t){console.error(t)}o(this,Yt,"f").set(e.element,!1)}},Ri=async function(e,t,s,i){t.shader!==void 0&&console.warn("[VFX-JS] Both `shader` and `effect` specified; `effect` takes precedence."),t.overflow!==void 0&&console.warn("[VFX-JS] `overflow` is shader-path only and is ignored by the effect path. Use each effect's own `outputRect` (with `dims.canvasRect` for fullscreen) to control its dst rect.");const n=Array.isArray(s)?[...s]:[s];o(this,C,"m",tr).call(this,n);const a=e.getBoundingClientRect(),f=Oi(e)?gr(a):vr(a),[c,l]=Bi(t.overflow),u=Li(t.intersection),d=e.style.opacity===""?1:Number.parseFloat(e.style.opacity);let h,p,v=!1;if(e instanceof HTMLImageElement)if(p="img",v=!!e.src.match(/\.gif/i),v){const S=await qs.create(e.src,o(this,E,"f"));$s.set(e,S),h=new j(o(this,V,"f"),S.getCanvas())}else{const S=await hr(e.src);h=new j(o(this,V,"f"),S)}else if(e instanceof HTMLVideoElement)h=new j(o(this,V,"f"),e),p="video";else if(e instanceof HTMLCanvasElement)e.hasAttribute("layoutsubtree")&&i?(h=new j(o(this,V,"f"),i),p="hic"):(h=new j(o(this,V,"f"),e),p="canvas");else{const S=await pr(e,d,void 0,this.maxTextureSize);h=new j(o(this,V,"f"),S),p="text"}const[y,P]=Wi(t.wrap);h.wrapS=y,h.wrapT=P,h.needsUpdate=!0;const M=t.autoCrop??!0;if(p!=="hic"){if(t.overlay!==!0)if(typeof t.overlay=="number")e.style.setProperty("opacity",t.overlay.toString());else{const S=p==="video"?"0.0001":"0";e.style.setProperty("opacity",S.toString())}}const w=Date.now()/1e3,_={type:p,element:e,isInViewport:!1,isInLogicalViewport:!1,width:f.right-f.left,height:f.bottom-f.top,passes:[],bufferTargets:new Map,startTime:w,enterTime:w,leaveTime:Number.NEGATIVE_INFINITY,release:t.release??Number.POSITIVE_INFINITY,isGif:v,isFullScreen:c,overflow:l,intersection:u,originalOpacity:d,srcTexture:h,zIndex:t.zIndex??0,backbuffer:void 0,autoCrop:M,effectLastRenderTime:w},b=Bs(()=>_.srcTexture,()=>si(_.srcTexture,"w"),()=>si(_.srcTexture,"h")),T={},W={};if(t.uniforms)for(const[S,x]of Object.entries(t.uniforms))typeof x=="function"?(W[S]=x,T[S]=x()):T[S]=x;_.effectUniformGenerators=W,_.effectStaticUniforms=T;const k={autoCrop:M,glslVersion:t.glslVersion??"300 es"},z=new Qr(o(this,V,"f"),o(this,et,"f"),o(this,E,"f"),n,k,b,!1,o(this,St,"f"));try{await z.initAll()}catch(S){throw o(this,C,"m",Ms).call(this,n),h.dispose(),e.style.setProperty("opacity",d.toString()),S}_.chain=z,o(this,C,"m",Gs).call(this,_,f,w),o(this,se,"f").push(_),o(this,se,"f").sort((S,x)=>S.zIndex-x.zIndex)},Mi=function(e){const t=i=>i.glslVersion===void 0&&e.glslVersion!==void 0?{...i,glslVersion:e.glslVersion}:i;if(Array.isArray(e.shader))return e.shader.map(t);const s=o(this,C,"m",sr).call(this,e.shader||"uvGradient");return[t({frag:s})]},Ai=function(e,t,s,i){const n=e.chain;if(!n)return;const a=o(this,E,"f");$s.get(e.element)?.update(),(e.type==="video"||e.isGif)&&(e.srcTexture.needsUpdate=!0);const f={...e.effectStaticUniforms??{}};if(e.effectUniformGenerators)for(const[_,b]of Object.entries(e.effectUniformGenerators))f[_]=b();const c=o(this,oe,"f").right-o(this,oe,"f").left,l=o(this,oe,"f").bottom-o(this,oe,"f").top,u=ur(t,l,o(this,xe,"f"),o(this,Ee,"f")),d=o(this,Te,"f")+o(this,xe,"f")-u.x,h=o(this,Pe,"f")+o(this,Ee,"f")-u.y,p=t.right-t.left,v=t.bottom-t.top,y=e.effectLastRenderTime??i,P=i-y;e.effectLastRenderTime=i;const w=o(this,C,"m",Tr).call(this)&&o(this,G,"f")?_i(o(this,G,"f")):null;n.run({time:i-e.startTime,deltaTime:P,mouse:[d*a,h*a],mouseViewport:[o(this,Te,"f")*a,o(this,Pe,"f")*a],intersection:s.intersection,enterTime:i-e.enterTime,leaveTime:i-e.leaveTime,resolvedUniforms:f,canvasSize:[c,l],canvasBufferSize:[c*a,l*a],elementSize:[p,v],elementBufferSize:[p*a,v*a],elementRectOnCanvasPx:{x:u.x*a,y:u.y*a,w:u.w*a,h:u.h*a},finalTarget:w,isVisible:s.isVisible})},Tr=function(){return o(this,fe,"f").length>0||o(this,ae,"f")!==null&&o(this,tt,"f")},tr=function(e){for(const t of e)if(o(this,He,"f").has(t))throw new Error("[VFX-JS] Effect instance already attached. Construct a new instance per `vfx.add()` / `postEffect`.");for(const t of e)o(this,He,"f").add(t)},Ms=function(e){for(const t of e)o(this,He,"f").delete(t)},ei=function(e){const t=e.hitTestPadBuffer,s=o(this,E,"f");return os({top:t.top/s,right:t.right/s,bottom:t.bottom/s,left:t.left/s})},Gs=function(e,t,s){const i=e.chain?o(this,C,"m",ei).call(this,e.chain):e.overflow,n=wr(t,i),a=e.isFullScreen||zi(o(this,qt,"f"),n),f=wr(o(this,qt,"f"),e.intersection.rootMargin),c=qo(f,t),l=e.isFullScreen||cn(f,t,c,e.intersection.threshold);!e.isInLogicalViewport&&l&&(e.enterTime=s,e.leaveTime=Number.POSITIVE_INFINITY),e.isInLogicalViewport&&!l&&(e.leaveTime=s),e.isInViewport=a,e.isInLogicalViewport=l;const u=a&&s-e.leaveTime<=e.release;if(u&&!e.chain&&e.passes.length>0){const d=e.passes[0].uniforms;d.intersection.value=c,d.enterTime.value=s-e.enterTime,d.leaveTime.value=s-e.leaveTime}return{isVisible:u,intersection:c,rectWithOverflow:n}},sr=function(e){return e in Br?Br[e]:e},le=function(e,t,s,i,n){const a=o(this,Ke,"f");n&&t!==null&&t!==o(this,G,"f")&&(a.bindFramebuffer(a.FRAMEBUFFER,t.fbo),a.viewport(0,0,t.width,t.height),a.clear(a.COLOR_BUFFER_BIT));const f=i.viewport;f&&f.value instanceof is&&f.value.set(s.x*o(this,E,"f"),s.y*o(this,E,"f"),s.w*o(this,E,"f"),s.h*o(this,E,"f"));try{Fo(a,o(this,et,"f"),e,t,s,o(this,Je,"f")[0],o(this,Je,"f")[1],o(this,E,"f"))}catch(c){console.error(c)}},As=function(e,t,s){const i=e.passes[0].uniforms.offset.value;i.x=t*o(this,E,"f"),i.y=s*o(this,E,"f")},Vi=function(e){const t=e.length===1&&!("frag"in e[0])?e[0]:null;if(t&&t.effect!==void 0){o(this,C,"m",ti).call(this,t,t.effect);return}const s=[],i=[];for(const a of e)"frag"in a&&i.push(a);for(let a=0;a<i.length-1;a++)i[a].target||(i[a]={...i[a],target:`pass${a}`});for(const a of e){let f,c,l;if("frag"in a)f=a.frag,c=new Zr(o(this,V,"f"),f,a.uniforms,a.persistent??!1,a.float??!1,a.size,a.target!==void 0,a.glslVersion),l=a.target;else{if(a.shader===void 0)throw new Error("VFXPostEffect requires `shader` (the `effect` path is not implemented yet).");f=o(this,C,"m",sr).call(this,a.shader),c=new Zr(o(this,V,"f"),f,a.uniforms,a.persistent??!1,a.float??!1,void 0,!1,a.glslVersion),a.persistent&&c.registerBufferUniform("backbuffer"),l=void 0}s.push(f);const u={};if(a.uniforms)for(const[d,h]of Object.entries(a.uniforms))typeof h=="function"&&(u[d]=h);o(this,fe,"f").push({pass:c,target:l,generators:u})}for(const a of i)a.target&&o(this,xt,"f").set(a.target,void 0);const n=o(this,fe,"f").map(a=>a.target).filter(a=>a!==void 0);for(let a=0;a<o(this,fe,"f").length;a++)for(const f of n)s[a].match(new RegExp(`uniform\\s+sampler2D\\s+${f}\\b`))&&o(this,fe,"f")[a].pass.registerBufferUniform(f)},ti=function(e,t){e.shader!==void 0&&console.warn("[VFX-JS] Both `shader` and `effect` specified on post-effect; `effect` takes precedence.");const s=Array.isArray(t)?[...t]:[t];o(this,C,"m",tr).call(this,s);const i=Bs(()=>{const f=o(this,G,"f");if(!f)throw new Error("[VFX-JS] post-effect chain active without target");return f.texture},()=>o(this,G,"f")?.width??0,()=>o(this,G,"f")?.height??0),n={autoCrop:!0,glslVersion:e.glslVersion??"300 es"},a=new Qr(o(this,V,"f"),o(this,et,"f"),o(this,E,"f"),s,n,i,!0,o(this,St,"f"));if(e.uniforms)for(const[f,c]of Object.entries(e.uniforms))typeof c=="function"?(o(this,Fs,"f")[f]=c,o(this,Gt,"f")[f]=c()):o(this,Gt,"f")[f]=c;L(this,ae,a,"f"),L(this,$t,Date.now()/1e3,"f"),a.initAll().then(()=>{o(this,ae,"f")===a&&L(this,tt,!0,"f")}).catch(f=>{console.error("[VFX-JS] Post-effect init failed; post-effect disabled:",f),o(this,ae,"f")===a&&(o(this,C,"m",Ms).call(this,o(this,ae,"f").effects),o(this,ae,"f").dispose(),L(this,ae,null,"f"),L(this,tt,!1,"f"))})},ki=function(e,t){const s=o(this,ae,"f");if(!s)return;const i=o(this,E,"f"),n={...o(this,Gt,"f")};for(const[p,v]of Object.entries(o(this,Fs,"f")))n[p]=v();const a=o(this,oe,"f").right-o(this,oe,"f").left,f=o(this,oe,"f").bottom-o(this,oe,"f").top,c=o(this,$t,"f"),l=t-c;L(this,$t,t,"f");const u=[a,f],d=[a*i,f*i],h={x:e.x*i,y:e.y*i,w:e.w*i,h:e.h*i};s.run({time:t-o(this,jt,"f"),deltaTime:l,mouse:[o(this,Te,"f")*i,o(this,Pe,"f")*i],mouseViewport:[o(this,Te,"f")*i,o(this,Pe,"f")*i],intersection:1,enterTime:0,leaveTime:0,resolvedUniforms:n,canvasSize:u,canvasBufferSize:d,elementSize:u,elementBufferSize:d,elementRectOnCanvasPx:h,finalTarget:null,isVisible:!0})},Ii=function(e,t){if(!o(this,G,"f"))return;let s=o(this,G,"f").texture;const i=new Map;for(const{pass:n,target:a}of o(this,fe,"f"))a&&n.backbuffer&&i.set(a,n.backbuffer.texture);for(let n=0;n<o(this,fe,"f").length;n++){const{pass:a,target:f,generators:c}=o(this,fe,"f")[n],l=n===o(this,fe,"f").length-1,u=o(this,Te,"f")+o(this,xe,"f"),d=o(this,Pe,"f")+o(this,Ee,"f"),h=a.size;if(h){const[p,v]=h;a.uniforms.src.value=s,a.uniforms.resolution.value.set(p,v),a.uniforms.offset.value.set(0,0),a.uniforms.time.value=t-o(this,jt,"f"),a.uniforms.mouse.value.set(u/e.w*p,d/e.h*v)}else a.setUniforms(s,o(this,E,"f"),e,t-o(this,jt,"f"),u,d);a.uniforms.passIndex.value=n,a.updateCustomUniforms(c);for(const[p,v]of i){const y=a.uniforms[p];y&&(y.value=v)}if(l)a.backbuffer?(a.uniforms.backbuffer&&(a.uniforms.backbuffer.value=a.backbuffer.texture),o(this,C,"m",le).call(this,a.pass,a.backbuffer.target,e,a.uniforms,!0),a.backbuffer.swap(),o(this,ce,"f").setUniforms(a.backbuffer.texture,o(this,E,"f"),e),o(this,C,"m",le).call(this,o(this,ce,"f").pass,null,e,o(this,ce,"f").uniforms,!1)):o(this,C,"m",le).call(this,a.pass,null,e,a.uniforms,!1);else if(a.backbuffer){a.uniforms.backbuffer&&(a.uniforms.backbuffer.value=a.backbuffer.texture);const p=h?Tt(0,0,h[0]/o(this,E,"f"),h[1]/o(this,E,"f")):e;o(this,C,"m",le).call(this,a.pass,a.backbuffer.target,p,a.uniforms,!0),a.backbuffer.swap(),s=a.backbuffer.texture,f&&i.set(f,a.backbuffer.texture)}else{const p=f??`postEffect${n}`;let v=o(this,xt,"f").get(p);const y=h?h[0]:e.w*o(this,E,"f"),P=h?h[1]:e.h*o(this,E,"f");(!v||v.width!==y||v.height!==P)&&(v?.dispose(),v=Er(o(this,V,"f"),y,P,{float:a.float}),o(this,xt,"f").set(p,v));const M=h?Tt(0,0,h[0]/o(this,E,"f"),h[1]/o(this,E,"f")):e;o(this,C,"m",le).call(this,a.pass,v,M,a.uniforms,!0),s=v.texture,f&&i.set(f,v.texture)}}},Ui=function(e,t){const s=e*o(this,E,"f"),i=t*o(this,E,"f");(!o(this,G,"f")||o(this,G,"f").width!==s||o(this,G,"f").height!==i)&&(o(this,G,"f")?.dispose(),L(this,G,Er(o(this,V,"f"),s,i),"f"));for(const{pass:n}of o(this,fe,"f"))n.persistent&&!n.backbuffer?n.initializeBackbuffer(o(this,V,"f"),e,t,o(this,E,"f")):n.backbuffer&&n.resizeBackbuffer(e,t)};function zi(r,e){return e.left<=r.right&&e.right>=r.left&&e.top<=r.bottom&&e.bottom>=r.top}function cn(r,e,t,s){return s===0?zi(r,e):t>=s}function Bi(r){return r===!0?[!0,Yr]:r===void 0?[!1,Yr]:[!1,os(r)]}function Li(r){const e=r?.threshold??0,t=os(r?.rootMargin??0);return{threshold:e,rootMargin:t}}function si(r,e){const t=r.source;if(!t)return 0;if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement)return e==="w"?t.naturalWidth:t.naturalHeight;if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)return e==="w"?t.videoWidth:t.videoHeight;const s=t;return e==="w"?s.width:s.height}function rr(r){return r==="repeat"?"repeat":r==="mirror"?"mirror":"clamp"}function Wi(r){if(!r)return["clamp","clamp"];if(Array.isArray(r))return[rr(r[0]),rr(r[1])];const e=rr(r);return[e,e]}function ri(r,e,t){return Math.max(e,Math.min(t,r))}function Oi(r){return!(r instanceof HTMLImageElement||r instanceof HTMLVideoElement||r instanceof HTMLCanvasElement)}function ln(){try{const r=document.createElement("canvas");return(r.getContext("webgl2")||r.getContext("webgl"))!==null}catch{return!1}}var ii=function(r,e,t,s,i){if(s==="m")throw new TypeError("Private method is not writable");if(s==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?r!==e||!i:!e.has(r))throw new TypeError("Cannot write private member to an object whose class did not declare it");return s==="a"?i.call(r,t):i?i.value=t:e.set(r,t),t},A=function(r,e,t,s){if(t==="a"&&!s)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?r!==e||!s:!e.has(r))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?s:t==="a"?s.call(r):s?s.value:e.get(r)},mt,B,Vs,Fe,Xi,Di,Hi,Ni;function hn(){if(typeof window>"u")throw"Cannot find 'window'. VFX-JS only runs on the browser.";if(typeof document>"u")throw"Cannot find 'document'. VFX-JS only runs on the browser."}function un(r){return{position:r?"fixed":"absolute",top:0,left:0,width:"0px",height:"0px","z-index":9999,"pointer-events":"none"}}class Cr{static init(e){try{return new Cr(e)}catch{return null}}constructor(e={}){if(mt.add(this),B.set(this,void 0),Vs.set(this,void 0),Fe.set(this,new Map),hn(),!ln())throw new Error("[VFX-JS] WebGL is not available in this environment.");const t=xo(e),s=document.createElement("canvas"),i=un(t.fixedCanvas);for(const[n,a]of Object.entries(i))s.style.setProperty(n,a.toString());t.zIndex!==void 0&&s.style.setProperty("z-index",t.zIndex.toString()),(t.wrapper??document.body).appendChild(s),ii(this,Vs,s,"f"),ii(this,B,new fn(t,s),"f"),t.autoplay&&A(this,B,"f").play()}async add(e,t,s){e instanceof HTMLImageElement?await A(this,mt,"m",Xi).call(this,e,t):e instanceof HTMLVideoElement?await A(this,mt,"m",Di).call(this,e,t):e instanceof HTMLCanvasElement?e.hasAttribute("layoutsubtree")&&s?await A(this,B,"f").addElement(e,t,s):await A(this,mt,"m",Hi).call(this,e,t):await A(this,mt,"m",Ni).call(this,e,t)}updateHICTexture(e,t){A(this,B,"f").updateHICTexture(e,t)}get maxTextureSize(){return A(this,B,"f").maxTextureSize}async addHTML(e,t){if(!_o())return console.warn("html-in-canvas not supported, falling back to dom-to-canvas"),this.add(e,t);t.overlay!==void 0&&console.warn("addHTML does not support overlay mode (layoutsubtree hides children). Ignoring overlay option.");const{overlay:s,...i}=t;let n=A(this,Fe,"f").get(e);n&&A(this,B,"f").removeElement(n);const{canvas:a,initialCapture:f}=await bo(e,{onCapture:c=>{A(this,B,"f").updateHICTexture(a,c)},maxSize:A(this,B,"f").maxTextureSize});n=a,A(this,Fe,"f").set(e,n),await A(this,B,"f").addElement(n,i,f)}remove(e){const t=A(this,Fe,"f").get(e);t?(Lr(t,e),A(this,Fe,"f").delete(e),A(this,B,"f").removeElement(t)):A(this,B,"f").removeElement(e)}updateEffects(e,t){const s=A(this,Fe,"f").get(e)??e;return A(this,B,"f").updateElementEffects(s,t)}async update(e){const t=A(this,Fe,"f").get(e);if(t){t.requestPaint();return}if(e instanceof HTMLImageElement)return A(this,B,"f").updateImageElement(e);if(e instanceof HTMLCanvasElement){A(this,B,"f").updateCanvasElement(e);return}else return A(this,B,"f").updateTextElement(e)}play(){A(this,B,"f").play()}stop(){A(this,B,"f").stop()}render(){A(this,B,"f").render()}destroy(){for(const[e,t]of A(this,Fe,"f"))Lr(t,e);A(this,Fe,"f").clear(),A(this,B,"f").destroy(),A(this,Vs,"f").remove()}}B=new WeakMap,Vs=new WeakMap,Fe=new WeakMap,mt=new WeakSet,Xi=function(e,t){return e.complete?A(this,B,"f").addElement(e,t):new Promise(s=>{e.addEventListener("load",()=>{A(this,B,"f").addElement(e,t),s()},{once:!0})})},Di=function(e,t){return e.readyState>=3?A(this,B,"f").addElement(e,t):new Promise(s=>{e.addEventListener("canplay",()=>{A(this,B,"f").addElement(e,t),s()},{once:!0})})},Hi=function(e,t){return A(this,B,"f").addElement(e,t)},Ni=function(e,t){return A(this,B,"f").addElement(e,t)};var dn=Ct(" <!>",1),pn=Ct('<div class="bg-base-300 text-base-content shadow-inner text-center md:rounded-box p-10 -mb-2 md:mb-0 relative z-10"><div class="prose items-center"><h2>Not found: [<!>]</h2> <button class="btn btn-secondary"><span class="mr-2 i-heroicons-outline-trash"></span> tags = []</button></div></div>'),mn=Ct('<div class="divider my-4 md:my-0"> </div>'),vn=Ct('<!> <div class="transition-all ease-in-out max-w-screen-lg md:mx-20 duration-500 hover:z-30 hover:shadow-xl md:shadow-sm md:hover:shadow-xl md:hover:-translate-y-0.5"><!></div>',1),gn=Ct('<!> <main class="flex flex-col relative z-10 bg-base-100 md:bg-transparent md:gap-8" itemprop="mainEntityOfPage" itemscope="" itemtype="https://schema.org/Blog"><div class="mx-auto p-3 rounded-md" id="site-land-page-title-display"><h1 class="mx-auto"><span class="md:font-medium font-extrabold md:text-7xl text-2xl">Mujina Production</span> <br/> <div class="text-right"><span class="font-normal md:text-4xl text-base">by Nagitch</span></div></h1></div> <div class="flex justify-center items-center flex-row justify-items-center"><div class="basis-10 md:basis-20 m-3 md:m-6 rounded-full backdrop-blur bg-slate-100/[.7]"><a href="https://github.com/Nagitch" target="_blank"><img alt="GitHub" src="/assets/social-logos/github-icon-1.svg"/></a></div> <div class="basis-10 md:basis-20 m-3 md:m-6 backdrop-blur rounded-2xl"><a href="https://twitter.com/NagitchDevelop" target="_blank"><img alt="Twitter / X" src="/assets/social-logos/twitter-logo-blue.svg"/></a></div> <div class="m-3 md:m-6 rounded-2xl backdrop-blur basis-16 md:basis-32"><a href="https://vrchat.com/home/user/usr_8292a43a-914e-4dc0-8c40-51809e1af76b" target="_blank"><img alt="VRChat" src="/assets/social-logos/VRC_Logo_TrademarkWhite.webp"/></a></div> <div class="basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur"><a href="https://mujina-prod.booth.pm/" target="_blank"><img alt="Booth" src="/assets/social-logos/booth-logo_icon_r.svg"/></a></div> <div class="basis-10 m-3 md:m-6 rounded-2xl backdrop-blur md:basis-24"><a href="https://soundcloud.com/nagitch" target="_blank"><img alt="SoundCloud" src="/assets/social-logos/soundcloud.svg"/></a></div></div> <div class="conatiner aspect-video my-5 pd-15"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="100%" src="https://www.youtube.com/embed/sdbYqEbr4-E?autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=sdbYqEbr4-E&amp;disablekb=1" title="YouTube video player" width="100%"></iframe></div> <div class="ml-6 my-4"><p><strong>「狢制作」</strong> (Mujina Production) は <strong>Nagitch</strong> の制作・個人事業名義です。 <br/> <a href="/portfolio"><span class="underline"><span class="text-base bg-no-repeat underline md:text-2xl bg-[length:100%_0%] bg-[position:0_88%] decoration-4 decoration-transparent group-hover:decoration-primary hover:bg-[length:100%_100%] hover:text-primary-content bg-gradient-to-t from-primary to-primary transition-all ease-in-out duration-300">📝ポートフォリオはこちら</span></span></a></p></div> <div class="divider mt-0 mb-8 hidden lg:flex"></div> <h1 class="ml-6 text-xl font-bold">最新のブログ</h1> <!></main> <div><div class="divider mt-0 mb-8 hidden lg:flex"></div> <!></div>',1),wn=Ct(`<!> <div class="flex flex-col justify-center flex-nowrap xl:flex-row xl:flex-wrap h-feed bg-[url('/assets/bg-header.webp')] bg-contain bg-scroll bg-no-repeat bg-top"><div class="flex-none w-full max-w-screen-xl mx-auto xl:mx-0"><!></div></div>`,1);function Cn(r,e){Qi(e,!1);const t=()=>Ur(Yi,"$storedPosts",i),s=()=>Ur(ao,"$page",i),[i,n]=oo();let a=Mt(),f=Mt(),c=[[],[],[]],l=Vr(()=>so(c,3)),u=Mt(F(l)[0]),d=Mt(F(l)[1]),h=Mt(F(l)[2]);Ji.set(""),Zi(()=>{{s().url.searchParams.get("tags")&&ot(d,s().url.searchParams.get("tags")?.split(",")??[]),ot(f,!0);const w=document.querySelector("#site-land-page-title-display");w instanceof HTMLElement&&new Cr().add(w,{overflow:100,shader:"rgbShift"})}}),Js(()=>t(),()=>{ot(a,t().filter(w=>!w.flags?.includes("unlisted")))}),Js(()=>(F(d),F(a),zr),()=>{F(d)&&(ot(u,F(d)?F(a).filter(w=>F(d).every(_=>w.tags?.includes(_))):F(a)),window.location.pathname==="/"&&zr(F(d).length>0?`?tags=${F(d).toString()}`:"/",{replaceState:!0}))}),Js(()=>F(u),()=>{F(u).length>1&&ot(h,[new Date(F(u)[0].published??F(u)[0].created).getFullYear()])}),eo(),qi();var p=wn(),v=fs(p);fo(v,{});var y=Me(v,2),P=ze(y),M=ze(P);no(M,()=>F(u),w=>{var _=gn(),b=fs(_);{var T=R=>{var I=pn(),D=ze(I),Z=ze(D),he=Me(ze(Z));Mr(he,1,()=>F(d),Ar,(q,Re,st)=>{kr();var as=dn(),rt=fs(as),it=Me(rt);{var Ys=Rt=>{var Gi=ji(",");Ge(Rt,Gi)};Qs(it,Rt=>{F(d),nt(()=>st+1<F(d).length)&&Rt(Ys)})}Ks(()=>Rr(rt,`'${F(Re)??""}'`)),Ge(q,as)}),kr(),Be(Z);var $=Me(Z,2);Be(D),Be(I),$i("click",$,()=>ot(d,[])),Ie(1,I,()=>Ue,()=>({delay:500,duration:300,x:100})),Ie(2,I,()=>Ue,()=>({duration:300,x:-100})),Ge(R,I)};Qs(b,R=>{F(f),F(u),nt(()=>F(f)&&F(u).length===0)&&R(T)})}var W=Me(b,2),k=Me(ze(W),12);Mr(k,1,()=>(F(u),nt(()=>F(u).slice(0,3))),Ar,(R,I,D)=>{const Z=io(()=>(F(I),nt(()=>new Date(F(I).published??F(I).created).getFullYear())));var he=vn(),$=fs(he);{var q=rt=>{var it=mn(),Ys=ro(it,!0);Ks(Rt=>Rr(Ys,Rt),[()=>(F(h),Ir(F(Z)),nt(()=>F(h).push(F(Z))&&F(Z)))]),Ie(1,it,()=>Ue,()=>({delay:500,duration:300,x:D%2?100:-100})),Ie(2,it,()=>Ue,()=>({duration:300,x:D%2?-100:100})),Ge(rt,it)},Re=Vr(()=>(F(h),Ir(F(Z)),nt(()=>!F(h).includes(F(Z)))));Qs($,rt=>{F(Re)&&rt(q)})}var st=Me($,2),as=ze(st);lo(as,{decoding:D<5?"auto":"async",loading:D<5?"eager":"lazy",get post(){return F(I)},preview:!0}),Be(st),Ie(1,st,()=>Ue,()=>({delay:500,duration:300,x:D%2?100:-100})),Ie(2,st,()=>Ue,()=>({duration:300,x:D%2?-100:100})),Ge(R,he)}),Be(W);var z=Me(W,2);let S;var x=Me(ze(z),2);co(x,{}),Be(z),Ks(()=>S=Ki(z,1,"sticky bottom-0 md:static md:mt-8",null,S,{hidden:!F(f)})),Ie(1,z,()=>Ue,()=>({delay:500,duration:300,x:F(u).length+1%2?100:-100})),Ie(2,z,()=>Ue,()=>({duration:300,x:F(u).length+1%2?-100:100})),Ge(w,_)}),Be(P),Be(y),Ge(r,p),to(),n()}export{Cn as component};
