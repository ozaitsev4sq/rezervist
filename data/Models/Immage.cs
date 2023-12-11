using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RezervistUmbraco.Data.Models
{
    public class Immage
    {
        public string Id { get; set; }

        public byte[] Data { get; set; }

        public string Name { get; set; }

        public Immage()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public Immage(byte[] data, string name = "") : this()
        {
            this.Data = data;
            this.Name = name;
        }
    }
}