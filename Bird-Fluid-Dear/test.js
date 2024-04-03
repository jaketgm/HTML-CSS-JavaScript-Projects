class Bird {

    static beak = [    [0, 1, 2],
      [4, 7, 6],
      [5, 6, 7]
    ];
  
    static v = Array.from([  [5, 0, 0],
        [-5, -2, 1],
        [-5, 0, 0],
        [-5, -2, -1],
        [0, 2, -6],
        [0, 2, 6],
        [2, 0, 0],
        [-3, 0, 0]
      ]);
    static def(n, m, s) {
      if (m) this.e(n.prototype, m);
      if (s) this.e(n, s);
      return n;
    }
  
    static e(o, p) {
      for (const prop in p) {
        if (Object.prototype.hasOwnProperty.call(p, prop)) {
          o[prop] = p[prop];
        }
      }
      return o;
    }
    
      
    // static v = [    [5, 0, 0],
    //   [-5, -2, 1],
    //   [-5, 0, 0],
    //   [-5, -2, -1],
    //   [0, 2, -6],
    //   [0, 2, 6],
    //   [2, 0, 0],
    //   [-3, 0, 0]
    // ];
  
    // static beak = [    [0, 1, 2],
    //   [4, 7, 6],
    //   [5, 6, 7]
    // ];
  
    static V = {
        x: 0,
        y: 0,
        z: 5000
      };
    static L = null;
  
    // static V = {
    //   x: 0,
    //   y: 0,
    //   z: 5000
    // };
  
    static obj = Bird.def(
      class {
        constructor() {
          this.vtr = new Bird.Vtr(),
          this.accel, this.width = 600, this.height = 600, this.depth = 300, this.ept, this.area = 200,
          this.msp = 4, this.mfrc = 0.1, this.coll = false;
          this.pos = new Bird.Vtr();
          this.vel = new Bird.Vtr();
          this.accel = new Bird.Vtr();
        }
  
        _coll(value) {
            this.coll = value;
        }
  
        param(w, h, dth) {
            this.width = w;
            this.height = h;
            this.depth = dth;
        }
        run(b) {
            if (this.coll) {
              const collumnVectorArray = {
                0: new Bird.Vtr(-this.width, this.pos.y, this.pos.z),
                1: new Bird.Vtr(this.width, this.pos.y, this.pos.z),
                2: new Bird.Vtr(this.pos.x, -this.height, this.pos.z),
                3: new Bird.Vtr(this.pos.x, this.height, this.pos.z),
                4: new Bird.Vtr(this.pos.x, this.pos.y, -this.depth),
                5: new Bird.Vtr(this.pos.x, this.pos.y, this.depth)
              };
          
              Object.keys(collumnVectorArray).forEach(key => {
                let collumnVector = collumnVectorArray[key];
                let vector = this.detect(collumnVector);
                vector.scale(5);
                this.accel.add(vector);
              });
            }
          
            if (Math.random() > 0.5) {
              this.fly(b);
            }
          
            this.move();
          }
          
  
        // run(b) {
        //     if (this.coll)
        // {
        //     const collVtrArray = [
        //         new Bird.Vtr(-this.width, this.pos.y, this.pos.z),
        //         new Bird.Vtr(this.width, this.pos.y, this.pos.z),
        //         new Bird.Vtr(this.pos.x, -this.height, this.pos.z),
        //         new Bird.Vtr(this.pos.x, this.height, this.pos.z),
        //         new Bird.Vtr(this.pos.x, this.pos.y, -this.depth),
        //         new Bird.Vtr(this.pos.x, this.pos.y, this.depth)
        //     ];

        //     collVtrArray.forEach(collVtr => {
        //         let vtr = this.detect(collVtr);
        //         vtr.scale(5);
        //         this.accel.add(vtr);
        //     });
        // }

        // if (Math.random() > 0.5)
        // {
        //     this.fly(b);
        // }
        // this.move();
        // }
  
        fly(b) {
            if (this.ept) {
                this.accel.add(this.meet(this.ept, 0.005));
              }
              this.accel.add(this.line(b));
              this.accel.add(this.togeth(b));
              this.accel.add(this.apart(b));
              
              // Add some random noise to the acceleration
              var noise = new Bird.Vtr(Math.random() * 2 - 1, Math.random() * 2 - 1);
              noise.scale(0.2); // Adjust the magnitude of the noise vector as needed
              this.accel.add(noise);
        }
  
        move() {
                    // Compute the new velocity based on the acceleration
        let newVel = this.vel.copy().add(this.accel);

        // Limit the velocity magnitude to the maximum speed
        let l = newVel.len();
        if (l > this.msp) {
        newVel.lowscale(l / this.msp);
        }

        // Update the position based on the new velocity
        this.pos.add(newVel);

        // Reset the acceleration to zero
        this.accel.set(0, 0, 0);

        // Update the velocity to the new value
        this.vel = newVel;
        }
  
        detect(pt) {
            var dir = new Bird.Vtr();
        dir.copy(this.pos);
        dir.sub(pt);
        var distSq = this.pos.dsq(pt);
        if (distSq !== 0) {
            dir.lowscale(distSq);
        }
        return dir;

        }
  
        rep(pt) {
            var dist = this.pos.dst(pt);
        if (dist < 150) {
            var direction = new Bird.Vtr();
            direction.subv(this.pos, pt);
            direction.scale(0.5 / dist);
            this.accel.add(direction);
        }
        }
  
        meet(pt, amt) {
            var dir = new Bird.Vtr();
        dir.subv(pt, this.pos);
        dir.scale(amt);
        return dir;
        }
  
        line(b) {
            var totvel = new Bird.Vtr();
        var cnt = 0;

        b.forEach(function(_b) {
        if (Math.random() > 0.6) return;
        var dist = _b.pos.dst(this.pos);
        if (dist > 0 && dist <= this.area) {
            totvel.add(_b.vel);
            cnt++;
        }
        }, this);

        if (cnt > 0) {
        totvel.lowscale(cnt);
        var v = totvel.len();
        if (v > this.mfrc) {
            totvel.lowscale(v / this.mfrc);
        }
        }

        return totvel;
        }
  
        togeth(b) {
            var _b, dist,
            plus = new Bird.Vtr(),
            dir = new Bird.Vtr(),
            cnt = 0;
        b.forEach(function(bird) {
            if (Math.random() > 0.6) return;
            _b = bird;
            dist = _b.pos.dst(this.pos);
            if (dist > 0 && dist <= this.area) {
                plus.add(_b.pos);
                cnt++;
            }
        }, this);
        if (cnt > 0) {
            plus.lowscale(cnt);
        }
        dir.subv(plus, this.pos);
        var l = dir.len();
        if (l > this.mfrc) {
            dir.lowscale(l / this.mfrc);
        }
        return dir;
        }
  
        apart(b) {
            let plus = new Bird.Vtr();
        b.forEach((_b) => {
        if (Math.random() > 0.6) return;
        let dist = _b.pos.dst(this.pos);
        if (dist > 0 && dist <= this.area) {
            let rep = new Bird.Vtr();
            rep.subv(this.pos, _b.pos);
            rep.level();
            rep.lowscale(dist);
            plus.add(rep);
        }
        });
        return plus;
        }
      },
      {}
    );
  
    static Build = Bird.def(
      class {
        constructor() {
          this.base = 0;
          this.left = 1;
          this.right = 2;
          this.pos = new Bird.Vtr();
          this.rot = new Bird.Vtr();
          this.bbase = this.tri(this.base);
          this.leftwing = this.tri(this.left);
          this.rightwing = this.tri(this.right);
        }
  
        matrix() {
            const objects = [this.bbase, this.leftwing, this.rightwing];

        // Apply vertex transformation to all objects
        objects.forEach((obj) => obj.vtx());

        // Apply wingY transformation to left and right wings
        objects.slice(1).forEach((wing) => wing.wingY(this.wY));

        // Apply rotation transformations to all objects
        objects.forEach((obj) => {
        obj.rotY(this.rot.y);
        obj.rotZ(this.rot.z);
        });

        // Apply translation transformation to all objects
        objects.forEach((obj) => obj.trans(this.pos));
        }
  
        draw() {
            const objects = [this.bbase, this.leftwing, this.rightwing];

        // Call the draw method on each object
        objects.forEach((obj) => obj.draw());
        }
  
        tri(i) {
            const [i0, i1, i2] = Bird.beak[i];
        const [v1, v2, v3] = [i0, i1, i2].map((index) => new Bird.Vtr(...Bird.v[index]));

        return new Bird.Tri(v1, v2, v3);
        }
  
        wang(y) {
            const [,,v1x] = Bird.v[Bird.beak[1][1]];
        this.rot.x = Math.atan2(y, v1x);
        }
  
        zpos() {
            const wings = [this.bbase, this.leftwing, this.rightwing];
            const [z1, z2, z3] = wings.map(wing => wing._z());
            return Math.min(...[z1, z2, z3]);
        }
  
        wing(y) {
            this.wY = y;
        }
      },
      {}
    );
  
    static Tri = Bird.def(
      class {
        constructor(p1, p2, p3) {
          this.mainv = [p1.copy(), p2.copy(), p3.copy()];
          this.Vtxs = [p1.copy(), p2.copy(), p3.copy()];
          this.bv = new Bird.Vtr(0.5, 0.5, 0.8);
        }
  
        draw() {
            let vertices = [];
        this.Vtxs.forEach(vtx => {
        vertices.push(vtx.Pt().x);
        vertices.push(vtx.Pt().y);
        });
        let col = this.col();
        Bird.$.fillStyle = col;
        Bird.$.strokeStyle = col;
        Bird.$.lineWidth = 0.1;
        Bird.$.beginPath();
        Bird.$.moveTo(vertices[0], vertices[1]);
        for (let i = 2; i < vertices.length; i += 2) {
        Bird.$.lineTo(vertices[i], vertices[i + 1]);
        }
        Bird.$.closePath();
        Bird.$.fill();
        Bird.$.stroke();
        }
  
        rotX(a) {
            var ang = a;
        this.Vtxs.forEach(
          function(e, i, a) {
            Bird.Matrix.rotX(e, ang);
          }
        );
        }
  
        rotY(a) {
            var ang = a;
        this.Vtxs.forEach(
          function(e, i, a) {
            Bird.Matrix.rotY(e, ang);
          }
        );
        }
  
        rotZ(a) {
            var ang = a;
        this.Vtxs.forEach(
          function(e, i, a) {
            Bird.Matrix.rotZ(e, ang);
          }
        );
        }
  
        trans(s) {
            var trans = s;
        this.Vtxs.forEach(
          function(e, i, a) {
            Bird.Matrix.trans(e, [trans.x, trans.y, trans.z]);
          }
        );
        }
  
        vtx(idx) {
            this.mainv.forEach((v, i) => {
                this.Vtxs[i].x = v.x;
                this.Vtxs[i].y = v.y;
                this.Vtxs[i].z = v.z;
              });
        }
  
        wingY(y) {
            this.Vtxs.forEach((vtx, i) => {
                if (i === 0) {
                  vtx.y = y;
                }
              });
        }
  
        _z() {
            return Math.min(...this.Vtxs.map(vtx => vtx.z));
        }
  
        col() {
            const e = 0.3, f = 0.3, g = 0.7;
        const bw = new Bird.Vtr(1, 1, 1);
        const n = this.norm();
        const v = this.Vtxs[0].copy().sub(Bird.V).level();
        const l = this.Vtxs[0].copy().sub(Bird.L).level();
        const p = l.p(n);
        const x1 = n.copy().scale(p * 2);
        const r = l.copy().sub(x1).scale(-1);
        const col = this.bv.copy().scale(p * e);
        const x2 = bw.copy().scale(Math.pow(Math.max(r.copy().scale(-1).p(v), 0), 20) * f);
        const x3 = this.bv.copy().scale(g);
        const x1_add = x2.add(x3);
        const x1_result = col.add(x1_add);
        //Here is where i could have the neon bird effect
        const _r = Math.floor(x1_result.x * 255);
        const _g = Math.floor(x1_result.y * 255);
        const _b = Math.floor(x1_result.z * 255);
        return `rgb(${_r},${_g},${_b})`;
        }
  
        norm() {
            // const v ={};
            // Object.keys(this.Vtxs).forEach(key => {
            //     v[key] = this.Vtxs[key].copy();
            // });

            // const v1 = v[0];
            // const v2 = v[1];
            // const v3 = v[3];

            // v3.sub(v2);
            // v1.sub(v3);
            // v3.cross(v1);
            // v3.level();


            var v1 = this.Vtxs[0];
        var v2 = this.Vtxs[1];
        var v3 = this.Vtxs[2];
        v3.sub(v2);
        v1.sub(v3);
        v3.cross(v1);
        v3.level();
        return v3;
        }
      },
      {}
    );
  
    static Vtr = Bird.def(
      class {
        constructor(x, y, z) {
          this.x = x || 0;
          this.y = y || 0;
          this.z = z || 0;
          this.fl = 1000;
        }
  
        Pt() {
            const { x, y } = this;
        const zsc = this.fl + this.z;
        const scale = this.fl / zsc;

        return { x, y, scale: scale };
        }
  
        set(x, y, z) {
            const values = {x, y, z};
        Object.keys(values).forEach(key => {
            this[key] = values[key];
        });
        return this;
        }

        len() {
            return [this.x, this.y, this.z].reduce((acc, val) => acc + val ** 2, 0) ** 0.5;
        }

        add(v, w) {
            Object.keys(v).forEach(key => {
                this[key] += v[key];
              });
              return this;  
        }

        sub(v, w) {
            Object.keys(v).forEach(key => {
                this[key] -= v[key];
            });
            return this;
        }

        subv(a, b) {
            this.set(a.x - b.x, a.y - b.y, a.z - b.z);
        return this;
        }

        scale(upd) {
            Object.keys(this).forEach(key => {
                if (key === 'x' || key === 'y' || key === 'z') {
                    this[key] *= upd;
                }
            });
            return this;
        }

        lowscale(upd) {
            if (upd !== 0)
        {
            var inv = 1 / upd;
            Object.keys(this).forEach(key => {
                if (key === 'x' || key === 'y' || key === 'z') {
                    this[key] *= inv;
                }
            });
        } else {
            Object.keys(this).forEach(key => {
                if (key === 'x' || key === 'y' || key === 'z') {
                    this[key] = 0;
                }
            });
        }
        return this;
        }

        copy(v) {
            Object.keys(v).forEach(key => {
                if (key === 'x' || key === 'y' || key === 'z') {
                    this[key] = v[key];
                }
            });
            return this;
        }

        dst(v) {
            return Math.sqrt(this.dsq(v));
        }

        dsq(v) {
            let distanceSquared = 0;
        Object.keys(this).forEach(key => {
            if (key === 'x' || key === 'y' || key === 'z') {
                const delta = this[key] - v[key];
                distanceSquared += Math.pow(delta, 2);
            }
        });
        return distanceSquared;
        }

        cross(v, w) {
            const x = this.x;
            const y = this.y;
            const z = this.z;
            
            Object.keys(this).forEach(key => {
                if (key === 'x') {
                    this[key] = y * v.z - z * v.y;
                } else if (key === 'y') {
                    this[key] = z * v.x - x * v.z;
                } else if (key === 'z') {
                    this[key] = x * v.y - y * v.x;
                }
            });
            
            return this;
        }
        

        // cross(v, w) {
        // var x = this.x,
        //   y = this.y,
        //   z = this.z;
        // this.x = y * v.z - z * v.y;
        // this.y = z * v.x - x * v.z;
        // this.z = x * v.y - y * v.x;
        // return this;            
        // }

        p(v) {
            let result = 0;
        Object.keys(this).forEach(key => {
            if (key === 'x' || key === 'y' || key === 'z') {
                const vKey = `v.${key}`;
                result += this[key] * eval(`${vKey}`);
            }
        });
        return result;
        }

        level() {
            return this.lowscale(this.len());
        }

        copy() {
            return new Bird.Vtr(this.x, this.y, this.z);
        }
    },
    {}
    );  
}

Bird.Matrix = {
    rotX: function(pt, angX) {
        var pos = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angX);
        var acos = Math.cos(angX);
        var xrot = {
            0: { 0: 1, 1: 0, 2: 0 },
            1: { 0: 0, 1: acos, 2: asin },
            2: { 0: 0, 1: -asin, 2: acos }
        };

        Object.keys(xrot).forEach(function(i) {
            var row = xrot[i];
            var result = 0;
            Object.keys(row).forEach(function(j) {
                result += pos[j] * row[j];
            });
            pt[i] = result;
        });
    },
    rotY: function(pt, angY) {
        var pos = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angY);
        var acos = Math.cos(angY);
        var yrot = [];
        yrot[0] = [acos, 0, asin];
        yrot[1] = [0, 1, 0];
        yrot[2] = [-asin, 0, acos];
        var calc = this.mm(pos, yrot);

        Object.keys(pt).forEach(key => {
            pt[key] = calc[key.toLowerCase().charCodeAt(0) - 120];
        });
    },
    rotZ: function(pt, angZ) {
        var pos = [pt.x, pt.y, pt.z];
        var asin = Math.sin(angZ);
        var acos = Math.cos(angZ);
        var zrot = [];
        zrot[0] = [acos, asin, 0];
        zrot[1] = [-asin, acos, 0];
        zrot[2] = [0, 0, 1];

        Object.keys(pos).forEach(i => {
            var calc = 0;
            Object.keys(zrot[i]).forEach(j => {
                calc += zrot[i][j] * pos[j];
            });
            pt[i] = calc;
        });
    },
    trans: function(pt, s) {
        [s[0], s[1], s[2]].forEach((value, index) => {
            pt[index === 0 ? 'x' : index === 1 ? 'y' : 'z'] += value;
        });
    },
    scale: function(pt, s) {
        const scaleFactors = [s[0], s[1], s[2]];
        const ptKeys = Object.keys(pt);

        ptKeys.forEach(key => {
            pt[key] *= scaleFactors[ptKeys.indexOf(key)];
        });
    },
    mm: function(m1, m2) {
        var calc = [];
        m2.forEach(function(row, i) {
            var sum = 0;
            row.forEach(function(val, j) {
                sum += m1[j] * val;
            });
            calc[i] = sum;
        });
        return calc;
    }
  }
  
function draw() {
    var c = document.getElementById('canv');
    Bird.$ = c.getContext("2d");
    Bird.canv = {
      w: c.width = window.innerWidth,
      h: c.height = window.innerHeight
    };
    Bird.L = new Bird.Vtr(0, 2000, 5000);
    Bird.V = new Bird.Vtr(0, 0, 5000);
    var birds = [];
    var b = [];
    for (var i = 0; i < 100; i++) {
      _b = b[i] = new Bird.obj();
      _b.pos.x = Math.random() * 800 - 400;
      _b.pos.y = Math.random() * 800 - 400;
      _b.pos.z = Math.random() * 800 - 400;
      _b.vel.x = Math.random() * 2 - 1;
      _b.vel.y = Math.random() * 2 - 1;
      _b.vel.z = Math.random() * 2 - 1;
      _b._coll(true);
      _b.param(400, 400, 800);
      bird = birds[i] = new Bird.Build();
      bird.phase = Math.floor(Math.random() * 62.83);
      bird.pos = b[i].pos;
    }
  
    run();
  
    function run() {
      window.requestAnimationFrame(run);
      draw();
    }
  
    function draw() {
      Bird.$.setTransform(1, 0, 0, 1, 0, 0);
      Bird.$.translate(Bird.canv.w / 2, Bird.canv.h / 2);
      Bird.$.clearRect(-Bird.canv.w / 2, -Bird.canv.h / 2, Bird.canv.w, Bird.canv.h);
      Bird.$.scale(1, -1);
      var arr = [];
      b.forEach(function(e, i, a) {
        var _b = b[i];
        _b.run(b);
        var bird = birds[i];
        bird.rot.y = Math.atan2(-_b.vel.z, _b.vel.x);
        bird.rot.z = Math.asin(_b.vel.y / _b.vel.len());
        bird.phase = (bird.phase + (Math.max(0, bird.rot.z) + 0.1)) % 62.83;
        bird.wing(Math.sin(bird.phase) * 5);
        bird.matrix();
        arr.push({
          z: bird.zpos(),
          o: bird
        });
      });
      arr.sort(function(a, b) {
        return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
      });
      arr.forEach(function(e, i, a) {
        e.o.draw();
      });
    }
  };
  draw();
  window.addEventListener('resize',function(){
     if(c.width!==window.innerWidth && c.height!==window.innerHeight){
       Bird.canv = {
        w: c.width = window.innerWidth,
        h: c.height = window.innerHeight
      };
     }
  });













// var Bird = {
//     def: function(n, m, s) {
//       if (m) this.e(n.prototype, m);
//       if (s) this.e(n, s);
//       return n;
//     },
//     e: function(o, p) {
//       for (prop in p) o[prop] = p[prop];
//       return o;
//     },
//     v: [
//       [5, 0, 0],
//       [-5, -2, 1],
//       [-5, 0, 0],
//       [-5, -2, -1],
//       [0, 2, -6],
//       [0, 2, 6],
//       [2, 0, 0],
//       [-3, 0, 0]
//     ],
//     beak: [
//       [0, 1, 2],
//       [4, 7, 6],
//       [5, 6, 7]
//     ],
//     L: null,
//     V: {
//       x: 0,
//       y: 0,
//       z: 5000
//     }
//   }

//   Bird.obj = Bird.def(
//     function() {
//       this.vtr = new Bird.Vtr(),
//         this.accel, this.width = 600, this.height = 600, this.depth = 300, this.ept, this.area = 200,
//         this.msp = 4, this.mfrc = 0.1, this.coll = false;
//       this.pos = new Bird.Vtr();
//       this.vel = new Bird.Vtr();
//       this.accel = new Bird.Vtr();
//     }, {
  
//       _coll: function(value) {
//       },
//       param: function(w, h, dth) {
//       },
//       run: function(b) {
//       },
//       fly: function(b) {
//       },
//       move: function() {
//       },
//       detect: function(pt) {
//       },
//       rep: function(pt) {
//       },
//       meet: function(pt, amt) {
//       },
//       line: function(b) {
//       },
//       togeth: function(b) {
//       },
//       apart: function(b) {
//       }
//     }
//   );

//   Bird.Build = Bird.def(
//     function() {
//       this.base = 0, this.left = 1, this.right = 2;
//       this.pos = new Bird.Vtr();
//       this.rot = new Bird.Vtr();
//       this.bbase = this.tri(this.base);
//       this.leftwing = this.tri(this.left);
//       this.rightwing = this.tri(this.right);
//     }, {
//       matrix: function() {
//       },
//       draw: function() {
//       },
//       tri: function(i) {
//       },
//       wang: function(y) {
//       },
//       zpos: function() {
//       },
//       wing: function(y) {
//       }
//     }
//   );


//   Bird.Tri = Bird.def(
//     function(p1, p2, p3) {
//       this.mainv = [p1.copy(), p2.copy(), p3.copy()];
//       this.Vtxs = [p1.copy(), p2.copy(), p3.copy()];
//       this.bv = new Bird.Vtr(0.5, 0.5, 0.8);
//     }, {
//       draw: function() {
//       },
//       rotX: function(a) {
//       },
//       rotY: function(a) {
//       },
//       rotZ: function(a) {
//       },
//       trans: function(s) {
//       },
//       vtx: function(idx) {
//       },
//       wingY: function(y) {
//       },
//       _z: function() {
//     },
//       col: function() {
//       },
//       norm: function() {
//       }
//     }
//   );

//   Bird.Vtr = Bird.def(
//     function(x, y, z) {
//       this.x = x || 0;
//       this.y = y || 0;
//       this.z = z || 0;
//       this.fl = 1000;
//     }, {
//       Pt: function() {
//       },
//       set: function(x, y, z) {
//       },
//       len: function() {
//       },
//       add: function(v, w) {       
//       },
//       sub: function(v, w) {
//       },
//       subv: function(a, b) {
//       },      
//       scale: function(upd) {
//       },
//       lowscale: function(upd) {
//       },
//       copy: function(v) {
//       },
//       dst: function(v) {
//       },
//       dsq: function(v) {
//       },
//       cross: function(v, w) {
//       },
//       p: function(v) {
//       },
//       level: function() {
//       },
//       copy: function() {
//       }
//     }
//   );

//   Bird.Matrix = {
//     rotX: function(pt, angX) {
//     },
//     rotY: function(pt, angY) {
//     },
//     rotZ: function(pt, angZ) {
//     },
//     trans: function(pt, s) {
//     },
//     scale: function(pt, s) {
//     },
//     mm: function(m1, m2) {
//     }
//   }

//   function draw() {
//     var c = document.getElementById('canv');
//     Bird.$ = c.getContext("2d");
//     Bird.canv = {
//       w: c.width = window.innerWidth,
//       h: c.height = window.innerHeight
//     };
//     Bird.L = new Bird.Vtr(0, 2000, 5000);
//     Bird.V = new Bird.Vtr(0, 0, 5000);
//     var birds = [];
//     var b = [];
//     for (var i = 0; i < 100; i++) {
//       _b = b[i] = new Bird.obj();
//       _b.pos.x = Math.random() * 800 - 400;
//       _b.pos.y = Math.random() * 800 - 400;
//       _b.pos.z = Math.random() * 800 - 400;
//       _b.vel.x = Math.random() * 2 - 1;
//       _b.vel.y = Math.random() * 2 - 1;
//       _b.vel.z = Math.random() * 2 - 1;
//       _b._coll(true);
//       _b.param(400, 400, 800);
//       bird = birds[i] = new Bird.Build();
//       bird.phase = Math.floor(Math.random() * 62.83);
//       bird.pos = b[i].pos;
//     }
  
//     run();
  
//     function run() {
//       window.requestAnimationFrame(run);
//       draw();
//     }
  
//     function draw() {
//       Bird.$.setTransform(1, 0, 0, 1, 0, 0);
//       Bird.$.translate(Bird.canv.w / 2, Bird.canv.h / 2);
//       Bird.$.clearRect(-Bird.canv.w / 2, -Bird.canv.h / 2, Bird.canv.w, Bird.canv.h);
//       Bird.$.scale(1, -1);
//       var arr = [];
//       b.forEach(function(e, i, a) {
//         var _b = b[i];
//         _b.run(b);
//         var bird = birds[i];
//         bird.rot.y = Math.atan2(-_b.vel.z, _b.vel.x);
//         bird.rot.z = Math.asin(_b.vel.y / _b.vel.len());
//         bird.phase = (bird.phase + (Math.max(0, bird.rot.z) + 0.1)) % 62.83;
//         bird.wing(Math.sin(bird.phase) * 5);
//         bird.matrix();
//         arr.push({
//           z: bird.zpos(),
//           o: bird
//         });
//       });
//       arr.sort(function(a, b) {
//         return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
//       });
//       arr.forEach(function(e, i, a) {
//         e.o.draw();
//       });
//     }
//   };
//   draw();
//   window.addEventListener('resize',function(){
//      if(c.width!==window.innerWidth && c.height!==window.innerHeight){
//        Bird.canv = {
//         w: c.width = window.innerWidth,
//         h: c.height = window.innerHeight
//       };
//      }
//   });





















// var Bird = {
//     def: function(n, m, s) {
//       if (m) this.e(n.prototype, m);
//       if (s) this.e(n, s);
//       return n;
//     },
//     e: function(o, p) {
//       for (prop in p) o[prop] = p[prop];
//       return o;
//     },
//     v: [
//       [5, 0, 0],
//       [-5, -2, 1],
//       [-5, 0, 0],
//       [-5, -2, -1],
//       [0, 2, -6],
//       [0, 2, 6],
//       [2, 0, 0],
//       [-3, 0, 0]
//     ],
//     beak: [
//       [0, 1, 2],
//       [4, 7, 6],
//       [5, 6, 7]
//     ],
//     L: null,
//     V: {
//       x: 0,
//       y: 0,
//       z: 5000
//     }
//   }

//   Bird.obj = Bird.def(
//     function() {
//       this.vtr = new Bird.Vtr(),
//         this.accel, this.width = 600, this.height = 600, this.depth = 300, this.ept, this.area = 200,
//         this.msp = 4, this.mfrc = 0.1, this.coll = false;
//       this.pos = new Bird.Vtr();
//       this.vel = new Bird.Vtr();
//       this.accel = new Bird.Vtr();
//     }, {
  
//       _coll: function(value) {
        // this.coll = value;
//       },
//       param: function(w, h, dth) {
        // this.width = w;
        // this.height = h;
        // this.depth = dth;
//       },
//       run: function(b) {
        // if (this.coll)
        // {
        //     const collVtrArray = [
        //         new Bird.Vtr(-this.width, this.pos.y, this.pos.z),
        //         new Bird.Vtr(this.width, this.pos.y, this.pos.z),
        //         new Bird.Vtr(this.pos.x, -this.height, this.pos.z),
        //         new Bird.Vtr(this.pos.x, this.height, this.pos.z),
        //         new Bird.Vtr(this.pos.x, this.pos.y, -this.depth),
        //         new Bird.Vtr(this.pos.x, this.pos.y, this.depth)
        //     ];

        //     collVtrArray.forEach(collVtr => {
        //         let vtr = this.detect(collVtr);
        //         vtr.scale(5);
        //         this.accel.add(vtr);
        //     });
        // }

        // if (Math.random() > 0.5)
        // {
        //     this.fly(b);
        // }
        // this.move();
//       },
//       fly: function(b) {
        // if (this.ept) {
        //     this.accel.add(this.meet(this.ept, 0.005));
        //   }
        //   this.accel.add(this.line(b));
        //   this.accel.add(this.togeth(b));
        //   this.accel.add(this.apart(b));
          
        //   // Add some random noise to the acceleration
        //   var noise = new Bird.Vtr(Math.random() * 2 - 1, Math.random() * 2 - 1);
        //   noise.scale(0.2); // Adjust the magnitude of the noise vector as needed
        //   this.accel.add(noise);
          
//       },
    //   move: function() {
        // // Compute the new velocity based on the acceleration
        // let newVel = this.vel.copy().add(this.accel);

        // // Limit the velocity magnitude to the maximum speed
        // let l = newVel.len();
        // if (l > this.msp) {
        // newVel.lowscale(l / this.msp);
        // }

        // // Update the position based on the new velocity
        // this.pos.add(newVel);

        // // Reset the acceleration to zero
        // this.accel.set(0, 0, 0);

        // // Update the velocity to the new value
        // this.vel = newVel;

    //   },
    //   detect: function(pt) {
        // var dir = new Bird.Vtr();
        // dir.copy(this.pos);
        // dir.sub(pt);
        // var distSq = this.pos.dsq(pt);
        // if (distSq !== 0) {
        //     dir.lowscale(distSq);
        // }
        // return dir;

//       },
//       rep: function(pt) {
        // var dist = this.pos.dst(pt);
        // if (dist < 150) {
        //     var direction = new Bird.Vtr();
        //     direction.subv(this.pos, pt);
        //     direction.scale(0.5 / dist);
        //     this.accel.add(direction);
        // }
//       },
//       meet: function(pt, amt) {
        // var dir = new Bird.Vtr();
        // dir.subv(pt, this.pos);
        // dir.scale(amt);
        // return dir;
//       },
//       line: function(b) {
        // var totvel = new Bird.Vtr();
        // var cnt = 0;

        // b.forEach(function(_b) {
        // if (Math.random() > 0.6) return;
        // var dist = _b.pos.dst(this.pos);
        // if (dist > 0 && dist <= this.area) {
        //     totvel.add(_b.vel);
        //     cnt++;
        // }
        // }, this);

        // if (cnt > 0) {
        // totvel.lowscale(cnt);
        // var v = totvel.len();
        // if (v > this.mfrc) {
        //     totvel.lowscale(v / this.mfrc);
        // }
        // }

        // return totvel;
//       },
//       togeth: function(b) {
        // var _b, dist,
        //     plus = new Bird.Vtr(),
        //     dir = new Bird.Vtr(),
        //     cnt = 0;
        // b.forEach(function(bird) {
        //     if (Math.random() > 0.6) return;
        //     _b = bird;
        //     dist = _b.pos.dst(this.pos);
        //     if (dist > 0 && dist <= this.area) {
        //         plus.add(_b.pos);
        //         cnt++;
        //     }
        // }, this);
        // if (cnt > 0) {
        //     plus.lowscale(cnt);
        // }
        // dir.subv(plus, this.pos);
        // var l = dir.len();
        // if (l > this.mfrc) {
        //     dir.lowscale(l / this.mfrc);
        // }
        // return dir;
//       },
//       apart: function(b) {
        // let plus = new Bird.Vtr();
        // b.forEach((_b) => {
        // if (Math.random() > 0.6) return;
        // let dist = _b.pos.dst(this.pos);
        // if (dist > 0 && dist <= this.area) {
        //     let rep = new Bird.Vtr();
        //     rep.subv(this.pos, _b.pos);
        //     rep.level();
        //     rep.lowscale(dist);
        //     plus.add(rep);
        // }
        // });
        // return plus;
//       }
//     }
//   );
//   Bird.Build = Bird.def(
//     function() {
//       this.base = 0, this.left = 1, this.right = 2;
//       this.pos = new Bird.Vtr();
//       this.rot = new Bird.Vtr();
//       this.bbase = this.tri(this.base);
//       this.leftwing = this.tri(this.left);
//       this.rightwing = this.tri(this.right);
//     }, {
//       matrix: function() {
        // const objects = [this.bbase, this.leftwing, this.rightwing];

        // // Apply vertex transformation to all objects
        // objects.forEach((obj) => obj.vtx());

        // // Apply wingY transformation to left and right wings
        // objects.slice(1).forEach((wing) => wing.wingY(this.wY));

        // // Apply rotation transformations to all objects
        // objects.forEach((obj) => {
        // obj.rotY(this.rot.y);
        // obj.rotZ(this.rot.z);
        // });

        // // Apply translation transformation to all objects
        // objects.forEach((obj) => obj.trans(this.pos));
//       },
//       draw: function() {
        // const objects = [this.bbase, this.leftwing, this.rightwing];

        // // Call the draw method on each object
        // objects.forEach((obj) => obj.draw());
//       },
//       tri: function(i) {
        // const [i0, i1, i2] = Bird.beak[i];
        // const [v1, v2, v3] = [i0, i1, i2].map((index) => new Bird.Vtr(...Bird.v[index]));

        // return new Bird.Tri(v1, v2, v3);

//       },
//       wang: function(y) {
        // const [,,v1x] = Bird.v[Bird.beak[1][1]];
        // this.rot.x = Math.atan2(y, v1x);

//       },
//       zpos: function() {
        // const wings = [this.bbase, this.leftwing, this.rightwing];
        // const [z1, z2, z3] = wings.map(wing => wing._z());
        // return Math.min(...[z1, z2, z3]);
//       },
//       wing: function(y) {
        // this.wY = y;
//       }
//     }
//   );
//   Bird.Tri = Bird.def(
//     function(p1, p2, p3) {
//       this.mainv = [p1.copy(), p2.copy(), p3.copy()];
//       this.Vtxs = [p1.copy(), p2.copy(), p3.copy()];
//       this.bv = new Bird.Vtr(0.5, 0.5, 0.8);
//     }, {
//       draw: function() {
        // let vertices = [];
        // this.Vtxs.forEach(vtx => {
        // vertices.push(vtx.Pt().x);
        // vertices.push(vtx.Pt().y);
        // });
        // let col = this.col();
        // Bird.$.fillStyle = col;
        // Bird.$.strokeStyle = col;
        // Bird.$.lineWidth = 0.1;
        // Bird.$.beginPath();
        // Bird.$.moveTo(vertices[0], vertices[1]);
        // for (let i = 2; i < vertices.length; i += 2) {
        // Bird.$.lineTo(vertices[i], vertices[i + 1]);
        // }
        // Bird.$.closePath();
        // Bird.$.fill();
        // Bird.$.stroke();

//       },
//       rotX: function(a) {
        // var ang = a;
        // this.Vtxs.forEach(
        //   function(e, i, a) {
        //     Bird.Matrix.rotX(e, ang);
        //   }
        // );
//       },
//       rotY: function(a) {
        // var ang = a;
        // this.Vtxs.forEach(
        //   function(e, i, a) {
        //     Bird.Matrix.rotY(e, ang);
        //   }
        // );
//       },
//       rotZ: function(a) {
        // var ang = a;
        // this.Vtxs.forEach(
        //   function(e, i, a) {
        //     Bird.Matrix.rotZ(e, ang);
        //   }
        // );
//       },
//       trans: function(s) {
        // var trans = s;
        // this.Vtxs.forEach(
        //   function(e, i, a) {
        //     Bird.Matrix.trans(e, [trans.x, trans.y, trans.z]);
        //   }
        // );
//       },
//       vtx: function(idx) {
        // this.mainv.forEach((v, i) => {
        //     this.Vtxs[i].x = v.x;
        //     this.Vtxs[i].y = v.y;
        //     this.Vtxs[i].z = v.z;
        //   });
//       },
//       wingY: function(y) {
        // this.Vtxs.forEach((vtx, i) => {
        //     if (i === 0) {
        //       vtx.y = y;
        //     }
        //   });
//       },
//       _z: function() {
        // return Math.min(...this.Vtxs.map(vtx => vtx.z));
//     },
//       col: function() {
        // const e = 0.3, f = 0.3, g = 0.7;
        // const bw = new Bird.Vtr(1, 1, 1);
        // const n = this.norm();
        // const v = this.Vtxs[0].copy().sub(Bird.V).level();
        // const l = this.Vtxs[0].copy().sub(Bird.L).level();
        // const p = l.p(n);
        // const x1 = n.copy().scale(p * 2);
        // const r = l.copy().sub(x1).scale(-1);
        // const col = this.bv.copy().scale(p * e);
        // const x2 = bw.copy().scale(Math.pow(Math.max(r.copy().scale(-1).p(v), 0), 20) * f);
        // const x3 = this.bv.copy().scale(g);
        // const x1_add = x2.add(x3);
        // const x1_result = col.add(x1_add);
        // //Here is where i could have the neon bird effect
        // const _r = Math.floor(x1_result.x * 255);
        // const _g = Math.floor(x1_result.y * 255);
        // const _b = Math.floor(x1_result.z * 255);
        // return `rgb(${_r},${_g},${_b})`;
//       },
//       norm: function() {
        // var v1 = this.Vtxs[0];
        // var v2 = this.Vtxs[1];
        // var v3 = this.Vtxs[2];
        // v3.sub(v2);
        // v1.sub(v3);
        // v3.cross(v1);
        // v3.level();
        // return v3;
//       }
//     }
//   );
//   Bird.Vtr = Bird.def(
//     function(x, y, z) {
//       this.x = x || 0;
//       this.y = y || 0;
//       this.z = z || 0;
//       this.fl = 1000;
//     }, {
//       Pt: function() {
        // const { x, y } = this;
        // const zsc = this.fl + this.z;
        // const scale = this.fl / zsc;

        // return { x, y, scale: scale };
//       },
//       set: function(x, y, z) {
        // const values = {x, y, z};
        // Object.keys(values).forEach(key => {
        //     this[key] = values[key];
        // });
        // return this;
//       },
//       len: function() {
        // return [this.x, this.y, this.z].reduce((acc, val) => acc + val ** 2, 0) ** 0.5;
//       },
//       add: function(v, w) {
        // Object.keys(v).forEach(key => {
        //     this[key] += v[key];
        //   });
        //   return this;          
//       },
//       sub: function(v, w) {
        // Object.keys(v).forEach(key => {
        //     this[key] -= v[key];
        // });
        // return this;
//       },
//       subv: function(a, b) {
        // this.set(a.x - b.x, a.y - b.y, a.z - b.z);
        // return this;
//       },      
//       scale: function(upd) {
        // Object.keys(this).forEach(key => {
        //     if (key === 'x' || key === 'y' || key === 'z') {
        //         this[key] *= upd;
        //     }
        // });
        // return this;
//       },
//       lowscale: function(upd) {
        // if (upd !== 0)
        // {
        //     var inv = 1 / upd;
        //     Object.keys(this).forEach(key => {
        //         if (key === 'x' || key === 'y' || key === 'z') {
        //             this[key] *= inv;
        //         }
        //     });
        // } else {
        //     Object.keys(this).forEach(key => {
        //         if (key === 'x' || key === 'y' || key === 'z') {
        //             this[key] = 0;
        //         }
        //     });
        // }
        // return this;
//       },
//       copy: function(v) {
        // Object.keys(v).forEach(key => {
        //     if (key === 'x' || key === 'y' || key === 'z') {
        //         this[key] = v[key];
        //     }
        // });
        // return this;
//       },
//       dst: function(v) {
        // return Math.sqrt(this.dsq(v));
//       },
//       dsq: function(v) {
        // let distanceSquared = 0;
        // Object.keys(this).forEach(key => {
        //     if (key === 'x' || key === 'y' || key === 'z') {
        //         const delta = this[key] - v[key];
        //         distanceSquared += Math.pow(delta, 2);
        //     }
        // });
        // return distanceSquared;
//       },
//       cross: function(v, w) {
        // // const { x, y, z } = this;
        // // Object.keys(this).forEach(key => {
        // //     if (key === 'x' || key === 'y' || key === 'z') {
        // //         const vKey = `v.${key}`;
        // //         this[key] = (y * eval(`${vKey}.z`) - z * eval(`${vKey}.y`));
        // //     }
        // // });
        // // this.x = x * v.y - y * v.x;
        // // return this;
        // var x = this.x,
        //   y = this.y,
        //   z = this.z;
        // this.x = y * v.z - z * v.y;
        // this.y = z * v.x - x * v.z;
        // this.z = x * v.y - y * v.x;
        // return this;
    //   },
    //   p: function(v) {
        // let result = 0;
        // Object.keys(this).forEach(key => {
        //     if (key === 'x' || key === 'y' || key === 'z') {
        //         const vKey = `v.${key}`;
        //         result += this[key] * eval(`${vKey}`);
        //     }
        // });
        // return result;
//         // return this.x * v.x + this.y * v.y + this.z * v.z;
//       },
//       level: function() {
        // return this.lowscale(this.len());
//       },
//       copy: function() {
        // return new Bird.Vtr(this.x, this.y, this.z);
//       }
//     }
//   );
//   Bird.Matrix = {
//     rotX: function(pt, angX) {
//         var pos = [pt.x, pt.y, pt.z];
//         var asin = Math.sin(angX);
//         var acos = Math.cos(angX);
//         var xrot = {
//             0: { 0: 1, 1: 0, 2: 0 },
//             1: { 0: 0, 1: acos, 2: asin },
//             2: { 0: 0, 1: -asin, 2: acos }
//         };

//         Object.keys(xrot).forEach(function(i) {
//             var row = xrot[i];
//             var result = 0;
//             Object.keys(row).forEach(function(j) {
//                 result += pos[j] * row[j];
//             });
//             pt[i] = result;
//         });
//     },
//     rotY: function(pt, angY) {
//         var pos = [pt.x, pt.y, pt.z];
//         var asin = Math.sin(angY);
//         var acos = Math.cos(angY);
//         var yrot = [];
//         yrot[0] = [acos, 0, asin];
//         yrot[1] = [0, 1, 0];
//         yrot[2] = [-asin, 0, acos];
//         var calc = this.mm(pos, yrot);

//         Object.keys(pt).forEach(key => {
//             pt[key] = calc[key.toLowerCase().charCodeAt(0) - 120];
//         });
//     },
//     rotZ: function(pt, angZ) {
//         var pos = [pt.x, pt.y, pt.z];
//         var asin = Math.sin(angZ);
//         var acos = Math.cos(angZ);
//         var zrot = [];
//         zrot[0] = [acos, asin, 0];
//         zrot[1] = [-asin, acos, 0];
//         zrot[2] = [0, 0, 1];

//         Object.keys(pos).forEach(i => {
//             var calc = 0;
//             Object.keys(zrot[i]).forEach(j => {
//                 calc += zrot[i][j] * pos[j];
//             });
//             pt[i] = calc;
//         });
//     },
//     trans: function(pt, s) {
//         [s[0], s[1], s[2]].forEach((value, index) => {
//             pt[index === 0 ? 'x' : index === 1 ? 'y' : 'z'] += value;
//         });
//     },
//     scale: function(pt, s) {
//         const scaleFactors = [s[0], s[1], s[2]];
//         const ptKeys = Object.keys(pt);

//         ptKeys.forEach(key => {
//             pt[key] *= scaleFactors[ptKeys.indexOf(key)];
//         });
//     },
//     mm: function(m1, m2) {
//         var calc = [];
//         m2.forEach(function(row, i) {
//             var sum = 0;
//             row.forEach(function(val, j) {
//                 sum += m1[j] * val;
//             });
//             calc[i] = sum;
//         });
//         return calc;
//     }
//   }
  
//   function draw() {
//     var c = document.getElementById('canv');
//     Bird.$ = c.getContext("2d");
//     Bird.canv = {
//       w: c.width = window.innerWidth,
//       h: c.height = window.innerHeight
//     };
//     Bird.L = new Bird.Vtr(0, 2000, 5000);
//     Bird.V = new Bird.Vtr(0, 0, 5000);
//     var birds = [];
//     var b = [];
//     for (var i = 0; i < 100; i++) {
//       _b = b[i] = new Bird.obj();
//       _b.pos.x = Math.random() * 800 - 400;
//       _b.pos.y = Math.random() * 800 - 400;
//       _b.pos.z = Math.random() * 800 - 400;
//       _b.vel.x = Math.random() * 2 - 1;
//       _b.vel.y = Math.random() * 2 - 1;
//       _b.vel.z = Math.random() * 2 - 1;
//       _b._coll(true);
//       _b.param(400, 400, 800);
//       bird = birds[i] = new Bird.Build();
//       bird.phase = Math.floor(Math.random() * 62.83);
//       bird.pos = b[i].pos;
//     }
  
//     run();
  
//     function run() {
//       window.requestAnimationFrame(run);
//       draw();
//     }
  
//     function draw() {
//       Bird.$.setTransform(1, 0, 0, 1, 0, 0);
//       Bird.$.translate(Bird.canv.w / 2, Bird.canv.h / 2);
//       Bird.$.clearRect(-Bird.canv.w / 2, -Bird.canv.h / 2, Bird.canv.w, Bird.canv.h);
//       Bird.$.scale(1, -1);
//       var arr = [];
//       b.forEach(function(e, i, a) {
//         var _b = b[i];
//         _b.run(b);
//         var bird = birds[i];
//         bird.rot.y = Math.atan2(-_b.vel.z, _b.vel.x);
//         bird.rot.z = Math.asin(_b.vel.y / _b.vel.len());
//         bird.phase = (bird.phase + (Math.max(0, bird.rot.z) + 0.1)) % 62.83;
//         bird.wing(Math.sin(bird.phase) * 5);
//         bird.matrix();
//         arr.push({
//           z: bird.zpos(),
//           o: bird
//         });
//       });
//       arr.sort(function(a, b) {
//         return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
//       });
//       arr.forEach(function(e, i, a) {
//         e.o.draw();
//       });
//     }
//   };
//   draw();
//   window.addEventListener('resize',function(){
//      if(c.width!==window.innerWidth && c.height!==window.innerHeight){
//        Bird.canv = {
//         w: c.width = window.innerWidth,
//         h: c.height = window.innerHeight
//       };
//      }
//   });